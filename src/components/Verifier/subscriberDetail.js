import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

import { Input, Button, Icon, Header, Table, Tab } from "semantic-ui-react";

import { getSubscriberdetail } from "../../actions/getSubscriberDetail";

import { urlHomeView, urlSearchedSubscriber } from "../../urls";

import main from "../../css/verifier.css";
import common from "../../css/common.css";

class SubscriberDetail extends Component {
  state = {
    enrollmentNo: "",
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const enrollmentNo = query.get("enrolment_number");
    if (enrollmentNo !== null) {
      this.setState({ enrollmentNo }, () =>
        this.props.getSubscriberDetail(this.state.enrollmentNo)
      );
    }
  }

  onChangeSearch = (e, { value }) => {
    this.setState({ enrollmentNo: value });
  };

  onSubmitSearch = () => {
    this.props.history.push(urlSearchedSubscriber(this.state.enrollmentNo));
    this.props.getSubscriberDetail(this.state.enrollmentNo);
  };

  render() {
    const { studentDetail } = this.props;
    return (
      <>
        <div className={common["back-btn"]}>
          <Link to={urlHomeView()}>
            <Button primary content="Back" icon="arrow left" />
          </Link>
        </div>
        <div className={main["main-content"]}>
          <div className={main["search-input"]}>
            <Input
              action
              onChange={this.onChangeSearch}
              placeholder="Enter Enrollment No."
            >
              <input value={this.state.enrollmentNo} />{" "}
              <Button onClick={this.onSubmitSearch} type="submit">
                Get Details
              </Button>
            </Input>
          </div>
          {!studentDetail.isFetching && (
            <>
              <div className={main["student-header"]}>
                <div className={common["person-detail"]}>
                  Name: {studentDetail.data.personName}
                  <br />
                  Enrollment No: {studentDetail.data.personEnrolment}
                  <br />
                  Branch: {studentDetail.data.personDepartment}
                </div>
                {studentDetail.data.idCard !== null && (
                  <div styleName="common.upload-card">
                    <Link
                      to={studentDetail.data.idCard}
                      onClick={(event) => {
                        event.preventDefault();
                        window.open(studentDetail.data.idCard);
                      }}
                    >
                      <Header as="h4" color="blue">
                        View Id Card <Icon color="black" name="id card" />
                      </Header>
                    </Link>{" "}
                  </div>
                )}
              </div>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Authority</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Last Marked By</Table.HeaderCell>
                    <Table.HeaderCell>Last Modified on</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {studentDetail.data.permissions.map((item, key) => {
                    return (
                      <Table.Row
                        positive={
                          item.status === "app" || item.status === "nap"
                        }
                        negative={
                          item.status !== "app" && item.status !== "nap"
                        }
                      >
                        <Table.Cell>{item.authority.fullName}</Table.Cell>
                        <Table.Cell>{item.statusDisplayName}</Table.Cell>
                        <Table.Cell>
                          {item.lastModifiedBy !== null && item.lastModifiedBy}
                        </Table.Cell>
                        <Table.Cell>
                          {moment(item.datetimeModified).format(
                            "Do MMMM YYYY, h:mm a"
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    studentDetail: state.getSubscriberDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSubscriberDetail: (enrollmentNo) => {
      dispatch(getSubscriberdetail(enrollmentNo));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SubscriberDetail));
