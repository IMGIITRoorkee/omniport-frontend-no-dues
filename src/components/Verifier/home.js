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

import { urlSubscriberDetail, urlPermissionView } from "../../urls";

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

const massStatusOptions = [
  { key: "app", value: "app", text: "Approved" },
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

  resetValue = () => {
    let { enrollmentMass } = this.state;
    for (let key in enrollmentMass) {
      enrollmentMass[key] = false;
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

  statusChangeAction = (permissionId, newStatus) => {
    let { statusChange } = this.state;
    statusChange[permissionId] = newStatus;
    this.setState({ statusChange });
  };

  onStatusChange = (permissionId) => {
    this.props.changeStatusDetails(
      this.state.statusChange[permissionId],
      permissionId
    );
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
  };

  onReportedClick = () => {
    this.props.getPermissionFilter("rep");
  };

  onRequestClick = () => {
    this.props.getPermissionFilter("req");
  };

  onCloseMassApprovalModal = () => {
    this.setState({
      massApprovalModalOpen: false,
    });
    this.resetValue();
  };

  render() {
    const { permissions } = this.props;
    const {
      presentFilter,
      enrollmentMass,
      statusChange,
      massApprovalStatus,
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
            active={presentFilter === "pen"}
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
                  options={massStatusOptions}
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
              {presentFilter !== "app" && presentFilter !== "nap" && (
                <Table.HeaderCell></Table.HeaderCell>
              )}
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Enrolment No.</Table.HeaderCell>
              <Table.HeaderCell>Branch</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>ID Card</Table.HeaderCell>
              <Table.HeaderCell>
                Status{" "}
                {presentFilter === "pen" && (
                  <Dropdown>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={this.onPendingClick}
                        text="Pending"
                      />
                      <Dropdown.Item
                        onClick={this.onReportedClick}
                        text="Reported"
                      />
                      <Dropdown.Item
                        onClick={this.onRequestClick}
                        text="Requested"
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Table.HeaderCell>
              {presentFilter !== "app" && presentFilter !== "nap" && (
                <Table.HeaderCell>Action</Table.HeaderCell>
              )}
              <Table.HeaderCell>Last Modified by</Table.HeaderCell>
              <Table.HeaderCell>Last Modified on</Table.HeaderCell>
              <Table.HeaderCell>Comments</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {permissions.data.map((item, key) => {
              return (
                <Table.Row>
                  {presentFilter !== "app" && presentFilter !== "nap" && (
                    <Table.Cell>
                      <Checkbox
                        onChange={() =>
                          this.checkboxOnClick(item.subscriber.personEnrolment)
                        }
                        checked={
                          enrollmentMass[item.subscriber.personEnrolment]
                        }
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell>{item.subscriber.personName}</Table.Cell>
                  <Table.Cell>{item.subscriber.personEnrolment}</Table.Cell>
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
                  {presentFilter !== "app" && presentFilter !== "nap" && (
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
                      <Button
                        onClick={() => this.onStatusChange(item.id)}
                        type="submit"
                        basic
                      >
                        Mark
                      </Button>
                    </Table.Cell>
                  )}
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
    getPermissionFilter: (filter) => {
      dispatch(getPermissionFilter(filter));
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
