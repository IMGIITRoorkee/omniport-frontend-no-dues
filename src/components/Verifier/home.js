import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-semantic-toasts";

import {
  Button,
  Table,
  Checkbox,
  Icon,
  Input,
  Select,
  Dimmer,
  Loader,
  Header,
  Modal,
  Form,
  TextArea,
  Dropdown,
  Segment,
  Label,
} from "semantic-ui-react";

import moment from "moment";

import { debounce } from "lodash";

import {
  getPermissionList,
  getPermissionFilter,
  changeStatusDetails,
  massUpdateStatus,
  commentOnPermission,
} from "../../actions/getPermissions";

import { getNoDuesSubscriberList } from "../../actions/getNoDuesSubscriberList";

import {
  urlSubscriberDetail,
  urlPermissionView,
  urlSearchedSubscriber,
  downloadSubscriberData,
} from "../../urls";

import main from "../../css/verifier.css";

const StatusDetail = ({ status }) => {
  if (status === "app") {
    return (
      <Header textAlign="center" as="h5" color="green">
        <Icon fitted name="check" size="tiny" color="green" /> Approved
      </Header>
    );
  } else if (status === "apc") {
    return (
      <Header textAlign="center" as="h5" color="green">
        Approved on Condition
      </Header>
    );
  }  else if (status === "nap") {
    return (
      <Header textAlign="center" as="h5" color="green">
        Not Applicable
      </Header>
    );
  } else if (status === "rep") {
    return (
      <Header textAlign="center" as="h5" color="yellow">
        <Icon fitted name="warning sign" size="tiny" color="yellow" /> Issue
        Raised
      </Header>
    );
  } else if (status === "req") {
    return (
      <Header textAlign="center" as="h5" color="blue">
        <Icon fitted name="clock outline" size="tiny" color="blue" /> Requested
      </Header>
    );
  }
};

const statusOptions = [
  { key: "app", value: "app", text: "Approved" },
  { key: "apc", value: "apc", text: "Approved on Condition" },
  { key: "rep", value: "rep", text: "Raise an Issue" },
  { key: "nap", value: "nap", text: "Not Applicable" },
];

class Home extends Component {
  state = {
    enrollmentMass: {},
    presentFilter: "pen",
    enrollmentNos: "",
    massApprovalModalOpen: false,
    massApprovalStatus: "",
    massApprovalCheckBox: false,
    reportPermissionModalOpen: false,
    reportPermissionId: "",
    reportPermissionText: "",
    reportPermissionAttachment: null,
    downloading: false,
    raisingAnIssue: false,
  };

  fileInputRef = React.createRef();

  onFilterClick = (filter) => {
    this.setState({ massApprovalCheckBox: false });
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
        for (let item of this.props.permissions.data) {
          enrollmentMassValue[item.subscriber.personEnrolment] = false;
        }

        this.setState({
          enrollmentMass: enrollmentMassValue,
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
    if (newStatus === "rep") {
      this.setState({
        reportPermissionModalOpen: true,
        reportPermissionId: permissionId,
      });
    } else {
      this.props.changeStatusDetails(newStatus, permissionId);
    }
  };

  // Report modal
  addReportAttachment = (e) => {
    this.setState({
      reportPermissionAttachment: e.target.files[0],
    });
  };

  cancelReport = () => {
    this.setState({
      reportPermissionAttachment: null,
      reportPermissionId: "",
      reportPermissionModalOpen: false,
      reportPermissionText: "",
    });
  };

  onChangeReportText = (e, { value }) => {
    this.setState({
      reportPermissionText: value,
    });
  };

  onSubmitReport = () => {
    const {
      reportPermissionText,
      reportPermissionId,
      reportPermissionAttachment,
    } = this.state;
    this.setState({ raisingAnIssue: true }, () => {
      this.props.commentOnPermission(
        reportPermissionId,
        reportPermissionText,
        reportPermissionAttachment,
        true
      );
      this.setState({ raisingAnIssue: false }, () => {
        this.cancelReport();
      });
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

  onChangeEnrollmentNo = (name, value) => {
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

  onClickNoDues = () => {
    this.setState({
      presentFilter: "nodues",
    });
    this.props.getNoDuesSubscriberList();
  };

  downloadStudentData = () => {
    this.setState(
      {
        downloading: true,
      },
      () => {
        axios
          .get(downloadSubscriberData())
          .then((response) => {
            const filename = response.headers["content-disposition"].split(
              "filename="
            )[1];
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            this.setState({
              downloading: false,
            });
          })
          .catch(() => {
            toast({
              type: "error",
              title: "Some error occurred, while downloading",
              animation: "fade up",
              icon: "frown outline",
              time: 4000,
            });
            this.setState({
              downloading: false,
            });
          });
      }
    );
  };

  render() {
    const { permissions, noDuesStudents } = this.props;
    const {
      presentFilter,
      enrollmentMass,
      massApprovalStatus,
      massApprovalCheckBox,
      downloading,
      raisingAnIssue,
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
          <Button
            onClick={() => this.onFilterClick("apc")}
            active={presentFilter === "apc"}
          >
            Approved On Condition
          </Button>
        </Button.Group>
        <Button
          onClick={this.downloadStudentData}
          icon="file excel"
          floated="right"
          content="Download Student Data"
          color="green"
          disabled={downloading}
          loading={downloading}
        />
        <Modal
          onClose={this.onCloseMassApprovalModal}
          open={this.state.massApprovalModalOpen}
          trigger={
            <Button
              onClick={this.onOpenMassApprovalModal}
              icon="group"
              floated="right"
              primary
              content="Mass Update"
            />
          }
        >
          <Modal.Header>Mass Update</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.TextArea
                onChange={this.onEnrollmentNosChange}
                value={this.state.enrollmentNos}
                label="Enrollment Numbers"
              />
              <Form.Field inline>
                <label>Status</label>
                <Form.Select
                  value={massApprovalStatus}
                  onChange={this.onMassApprovalStatus}
                  placeholder="New Status"
                  options={statusOptions.filter((x) => x.key !== "rep")}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.onCloseMassApprovalModal || permissions.isChanging}
              content="Cancel"
              negative
            />
            <Button
              disabled={
                permissions.isChanging || this.state.enrollmentNos.trim() === ""
              }
              loading={permissions.isChanging}
              onClick={this.onPostMassUpdate}
              content="Update Status"
              positive
            />
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.reportPermissionModalOpen || raisingAnIssue}>
          <Modal.Header>Raise an Issue</Modal.Header>
          <Modal.Content>
            <Form>
              <TextArea
                onChange={this.onChangeReportText}
                placeholder="Raise an issue by commenting here"
                value={this.state.reportPermissionText}
              />
              {this.state.reportPermissionAttachment !== null && (
                <Label>
                  {this.state.reportPermissionAttachment.name}
                  <Icon
                    name="delete"
                    onClick={() =>
                      this.setState({ reportPermissionAttachment: null })
                    }
                  />
                </Label>
              )}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.cancelReport} content="Cancel" />
            <Button
              primary
              content="Attach a file"
              onClick={() => this.fileInputRef.current.click()}
              icon="upload"
            />
            <input
              ref={this.fileInputRef}
              type="file"
              hidden
              onChange={this.addReportAttachment}
            />
            <Button
              disabled={
                raisingAnIssue || this.state.reportPermissionText.trim() === ""
              }
              loading={raisingAnIssue}
              positive
              onClick={this.onSubmitReport}
              icon="paper plane"
              content="Comment and Raise Issue"
            />
          </Modal.Actions>
        </Modal>
        <Link to={urlSubscriberDetail()}>
          <Button icon="eye" floated="right" content="View Student Status" />
        </Link>
        <Button
          icon="certificate"
          active={presentFilter === "nodues"}
          floated="right"
          content="Greencard Holders"
          color="green"
          onClick={this.onClickNoDues}
        />
        {presentFilter === "nodues" ? (
          <>
            {noDuesStudents.isFetching && (
              <Dimmer active inverted>
                <Loader />
              </Dimmer>
            )}
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Enrolment No. </Table.HeaderCell>
                  <Table.HeaderCell>Branch</Table.HeaderCell>
                  <Table.HeaderCell>Department</Table.HeaderCell>
                  <Table.HeaderCell>ID Card</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {noDuesStudents.data.map((item, key) => {
                  return (
                    <Table.Row>
                      <Table.Cell>{item.personName}</Table.Cell>
                      <Table.Cell>
                        <Link to={urlSearchedSubscriber(item.personEnrolment)}>
                          {item.personEnrolment}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{item.personDegree}</Table.Cell>
                      <Table.Cell>{item.personDepartment}</Table.Cell>
                      <Table.Cell textAlign="center">
                        {item.idCard !== null && (
                          <Link
                            to={item.idCard}
                            onClick={(event) => {
                              event.preventDefault();
                              window.open(item.idCard);
                            }}
                          >
                            <Icon name="eye" size="large" />
                          </Link>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </>
        ) : (
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
                <Table.HeaderCell>Enrolment No. </Table.HeaderCell>
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
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>
                  <Input
                    onChange={debounce(
                      (e, { name, value }) =>
                        this.onChangeEnrollmentNo(name, value),
                      500
                    )}
                    icon="search"
                    placeholder="Search with enrolment number"
                    fluid
                  />
                </Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
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
                        checked={
                          enrollmentMass[item.subscriber.personEnrolment]
                        }
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
                        value={item.status}
                        onChange={(e, { value }) => {
                          this.statusChangeAction(item.id, value);
                        }}
                        options={statusOptions}
                        placeholder="New Status"
                        selectOnNavigation={false}
                        selectOnBlur={false}
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
                      {item.latestCommentBy === "subscriber" && (
                        <Header as="h5" style={{ marginTop: 10 }} color="red">
                          Unread comments
                        </Header>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    permissions: state.getPermissionList,
    noDuesStudents: state.getNoDuesSubscriberList,
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
    getNoDuesSubscriberList: () => {
      dispatch(getNoDuesSubscriberList());
    },
    commentOnPermission: (permissionId, content, attachment, markReported) => {
      dispatch(
        commentOnPermission(permissionId, attachment, content, markReported)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
