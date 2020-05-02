import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  Button,
  Table,
  Checkbox,
  Icon,
  Input,
  Select,
  Dimmer,
  Loader,
  ItemExtra,
  Header,
  Modal,
  Form,
  Dropdown,
} from "semantic-ui-react";

import moment from "moment";

import {
  getPermissionList,
  getPermissionFilter,
  changeStatusDetails,
  massUpdateStatus,
} from "../../actions/getPermissions";

import {
  urlSubscriberDetail,
  urlPermissionView,
  urlSearchedSubscriber,
} from "../../urls";

import main from "../../css/verifier.css";

const StatusDetail = ({ status }) => {
  if (status === "app") {
    return (
      <Header as="h5" color="green">
        <Icon fitted name="check" size="tiny" color="green" /> Approved
      </Header>
    );
  } else if (status === "nap") {
    return (
      <Header as="h5" color="grey">
        Not Applicable
      </Header>
    );
  } else if (status === "rep") {
    return (
      <Header as="h5" color="yellow">
        <Icon fitted name="warning sign" size="tiny" color="yellow" /> Reported
      </Header>
    );
  } else if (status === "req") {
    return (
      <Header as="h5" color="blue">
        <Icon fitted name="clock outline" size="tiny" color="blue" /> Requested
      </Header>
    );
  }
};

const statusOptions = [
  { key: "app", value: "app", text: "Approved" },
  { key: "rep", value: "rep", text: "Reported" },
  { key: "nap", value: "nap", text: "Not Applicable" },
];

class Home extends Component {
  state = {
    enrollmentMass: {},
    statusChange: {},
    presentFilter: "pen",
    enrollmentNos: "",
    massApprovalModalOpen: false,
    massApprovalStatus: "",
    massApprovalCheckBox: false,
  };

  onFilterClick = (filter) => {
    if (filter === "pen") {
      this.props.getPermissionFilter("req&status=rep");
    } else {
      this.props.getPermissionFilter(filter);
    }
    this.setState({ presentFilter: filter });
  };

  componentDidMount() {
    this.props.getPermissionFilter("req&status=rep");
  }

  componentDidUpdate(prevProps) {
    if (!this.props.permissions.isFetching) {
      if (prevProps.permissions.data !== this.props.permissions.data) {
        let enrollmentMassValue = {};
        let statusChangeValue = {};
        for (let item of this.props.permissions.data) {
          enrollmentMassValue[item.subscriber.personEnrolment] = false;
          statusChangeValue[item.id] = "";
        }

        this.setState({
          enrollmentMass: enrollmentMassValue,
          statusChange: statusChangeValue,
        });
      }
    }
  }

  resetValue = (required) => {
    let { enrollmentMass } = this.state;
    for (let key in enrollmentMass) {
      enrollmentMass[key] = required;
    }
    this.setState({ enrollmentMass });
  };

  onEnrollmentNosChange = (e, { value }) => {
    this.setState({
      enrollmentNos: value
        .replace(/[\r\n]+/gm, ",")
        .replace(/[,]+/g, ",")
        .replace(/(^\s+|\s+$)/g, ""),
    });
  };

  onMassApprovalStatus = (e, { value }) => {
    this.setState({ massApprovalStatus: value });
  };

  onPostMassUpdate = () => {
    const { enrollmentNos, massApprovalStatus } = this.state;
    let enrollmentList = enrollmentNos
      .replace(/[\r\n]+/gm, ",")
      .replace(/[,]+/g, ",")
      .replace(/(^\s+|\s+$)/g, "")
      .split(",")
      .map((s) => s.trim());
    this.props.massUpdateStatus(enrollmentList, massApprovalStatus);
    window.location.reload(false);
    this.onCloseMassApprovalModal();
  };

  checkboxOnClick = (enrollmentNo) => {
    let { enrollmentMass } = this.state;
    enrollmentMass[enrollmentNo] = !enrollmentMass[enrollmentNo];
    this.setState({ enrollmentMass });
  };

  massApprovalCheckBoxOnClick = () => {
    this.setState(
      { massApprovalCheckBox: !this.state.massApprovalCheckBox },
      () => {
        this.resetValue(this.state.massApprovalCheckBox);
      }
    );
  };

  statusChangeAction = (permissionId, newStatus) => {
    let { statusChange } = this.state;
    statusChange[permissionId] = newStatus;
    this.setState({ statusChange }, () => {
      let { statusChange } = this.state;
      this.props.changeStatusDetails(
        this.state.statusChange[permissionId],
        permissionId
      );
      statusChange[permissionId] = "";
      this.setState({ statusChange });
    });
  };

  onOpenMassApprovalModal = () => {
    let selectedEnrolment = [];
    for (let key in this.state.enrollmentMass) {
      if (this.state.enrollmentMass[key]) {
        selectedEnrolment.push(key);
      }
    }
    this.setState({
      enrollmentNos: selectedEnrolment.join(","),
      massApprovalModalOpen: true,
    });
  };

  onPendingClick = () => {
    this.props.getPermissionFilter("req&status=rep");
    this.resetValue(false);
    this.setState({ massApprovalCheckBox: false });
  };

  onReportedClick = () => {
    this.props.getPermissionFilter("rep");
    this.resetValue(false);
    this.setState({ massApprovalCheckBox: false });
  };

  onRequestClick = () => {
    this.props.getPermissionFilter("req");
    this.resetValue(false);
    this.setState({ massApprovalCheckBox: false });
  };

  onChangeEnrollmentNo = (e, { value }) => {
    const { presentFilter } = this.state;

    if (presentFilter === "pen") {
      this.props.getPermissionFilter("req&status=rep", value);
    } else {
      this.props.getPermissionFilter(presentFilter, value);
    }
  };

  onCloseMassApprovalModal = () => {
    this.setState({
      massApprovalModalOpen: false,
    });
    this.resetValue(false);
    this.setState({ massApprovalCheckBox: false });
  };

  render() {
    const { permissions } = this.props;
    const {
      presentFilter,
      enrollmentMass,
      statusChange,
      massApprovalStatus,
      massApprovalCheckBox,
    } = this.state;

    if (permissions.isFetching) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }

    return (
      <div className={main["main-content"]}>
        <Button.Group className={main["white-bg"]} basic>
          <Button
            onClick={() => this.onFilterClick("pen")}
            active={
              presentFilter === "pen" ||
              presentFilter === "rep" ||
              presentFilter === "req"
            }
          >
            Pending
          </Button>
          <Button
            onClick={() => this.onFilterClick("app")}
            active={presentFilter === "app"}
          >
            Approved
          </Button>
          <Button
            onClick={() => this.onFilterClick("nap")}
            active={presentFilter === "nap"}
          >
            Not Applicable
          </Button>
        </Button.Group>
        <Modal
          onClose={this.onCloseMassApprovalModal}
          open={this.state.massApprovalModalOpen}
          trigger={
            <Button
              onClick={this.onOpenMassApprovalModal}
              icon="group"
              floated="right"
              primary
              content="Mass Approval"
            />
          }
        >
          <Modal.Header>Mass Approval</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.TextArea
                onChange={this.onEnrollmentNosChange}
                value={this.state.enrollmentNos}
                label="Enrollment Nos"
              />
              <Form.Field inline>
                <label>Mass Status</label>
                <Form.Select
                  value={massApprovalStatus}
                  onChange={this.onMassApprovalStatus}
                  placeholder="New Status"
                  options={statusOptions}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.onCloseMassApprovalModal}
              content="Cancel"
              negative
            />
            <Button
              onClick={this.onPostMassUpdate}
              content="Update Status"
              positive
            />
          </Modal.Actions>
        </Modal>
        <Link to={urlSubscriberDetail()}>
          <Button icon="eye" floated="right" content="View Student Status" />
        </Link>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {" "}
                <Checkbox
                  onChange={() => this.massApprovalCheckBoxOnClick()}
                  checked={massApprovalCheckBox}
                />{" "}
              </Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>
                Enrolment No. <Input onChange={this.onChangeEnrollmentNo} placeholder="Search with enrolment no." />
              </Table.HeaderCell>
              <Table.HeaderCell>Branch</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>ID Card</Table.HeaderCell>
              <Table.HeaderCell>
                Status{" "}
                {(presentFilter === "pen" ||
                  presentFilter === "rep" ||
                  presentFilter === "req") && (
                  <Dropdown>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => this.onFilterClick("pen")}
                        text="Pending"
                      />
                      <Dropdown.Item
                        onClick={() => this.onFilterClick("rep")}
                        text="Reported"
                      />
                      <Dropdown.Item
                        onClick={() => this.onFilterClick("req")}
                        text="Requested"
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <Table.HeaderCell>Last Modified by</Table.HeaderCell>
              <Table.HeaderCell>Last Modified on</Table.HeaderCell>
              <Table.HeaderCell>Comments</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {permissions.data.map((item, key) => {
              return (
                <Table.Row>
                  <Table.Cell>
                    <Checkbox
                      onChange={() =>
                        this.checkboxOnClick(item.subscriber.personEnrolment)
                      }
                      checked={enrollmentMass[item.subscriber.personEnrolment]}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.subscriber.personName}</Table.Cell>
                  <Table.Cell>
                    <Link
                      to={urlSearchedSubscriber(
                        item.subscriber.personEnrolment
                      )}
                    >
                      {item.subscriber.personEnrolment}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{item.subscriber.personDegree}</Table.Cell>
                  <Table.Cell>{item.subscriber.personDepartment}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.subscriber.idCard !== null && (
                      <Link
                        to={item.subscriber.idCard}
                        onClick={(event) => {
                          event.preventDefault();
                          window.open(item.subscriber.idCard);
                        }}
                      >
                        <Icon name="eye" size="large" />
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <StatusDetail status={item.status} />
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Select
                      value={statusChange[item.id]}
                      onChange={(e, { value }) => {
                        this.statusChangeAction(item.id, value);
                      }}
                      compact
                      options={statusOptions}
                      placeholder="New Status"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {item.lastModifiedBy !== null && item.lastModifiedBy}
                  </Table.Cell>
                  <Table.Cell>
                    {moment(item.datetimeModified).format(
                      "Do MMMM YYYY, h:mm a"
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Link to={urlPermissionView(item.id)}>
                      <Button icon="comments" primary />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    permissions: state.getPermissionList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPermissionList: () => {
      dispatch(getPermissionList());
    },
    getPermissionFilter: (filter, enrolment_no = "") => {
      dispatch(getPermissionFilter(filter, enrolment_no));
    },
    changeStatusDetails: (permissionId, newStatus) => {
      dispatch(changeStatusDetails(permissionId, newStatus));
    },
    massUpdateStatus: (enrollmentList, newStatus) => {
      dispatch(massUpdateStatus(enrollmentList, newStatus));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
