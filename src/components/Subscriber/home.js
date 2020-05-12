import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Dimmer,
  Loader,
  Table,
  Header,
  Icon,
  Button,
  Popup,
  Modal,
  Label,
  Segment,
} from "semantic-ui-react";

import { connect } from "react-redux";

import { urlPermissionView } from "../../urls";

import {
  getPermissionList,
  changeStatusDetails,
} from "../../actions/getPermissions";

import main from "../../css/subscriber.css";

class AskForApprovalBtn extends Component {
  state = {
    modalOpen: false,
    loading: false,
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  proceedApproval = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.props.changeStatus("req", this.props.permissionId);
        this.setState({
          loading: false,
        });
        this.closeModal();
      }
    );
  };

  render() {
    if (this.props.description === "") {
      return (
        <Button
          loading={this.state.loading}
          onClick={this.proceedApproval}
          basic
          color="grey"
        >
          <Icon name="paper plane" /> Ask For Approval
        </Button>
      );
    } else {
      return (
        <Modal
          trigger={
            <Button
              loading={this.state.loading}
              onClick={this.openModal}
              basic
              color="grey"
            >
              <Icon name="paper plane" /> Ask For Approval
            </Button>
          }
          open={this.state.modalOpen}
        >
          <Modal.Header>Ask For Approval</Modal.Header>
          <Modal.Content>{this.props.description}</Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeModal} content="Cancel" negative />
            <Button
              onClick={this.proceedApproval}
              content="Proceed"
              loading={this.state.loading}
              positive
            />
          </Modal.Actions>
        </Modal>
      );
    }
  }
}

const StatusBtn = ({ status, changeStatus, permissionId, description }) => {
  if (status === "nrq") {
    return (
      <AskForApprovalBtn
        changeStatus={changeStatus}
        permissionId={permissionId}
        description={description}
      />
    );
  } else if (status === "req") {
    return (
      <Header as="h5" color="blue">
        <Icon fitted name="clock outline" size="tiny" color="blue" /> Requested
      </Header>
    );
  } else if (status === "rep") {
    return (
      <Header as="h5" color="yellow">
        <Icon fitted name="warning sign" size="tiny" color="yellow" /> Issue
        Raised
      </Header>
    );
  } else if (status === "app") {
    return (
      <Header as="h5" color="green">
        <Icon fitted name="check" size="tiny" color="green" /> Approved
      </Header>
    );
  } else if (status === "nap") {
    return (
      <Header as="h5" color="green">
        <Icon fitted name="check" size="tiny" color="green" /> Not Applicable
      </Header>
    );
  }
};

class SubscriberHome extends Component {
  componentDidMount() {
    this.props.getPermissionList();
  }

  render() {
    const { permissions, changeStatusDetails } = this.props;
    if (permissions.isFetching) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <div className={main["permission-table"]}>
        <Table size="large" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={10}>Authority</Table.HeaderCell>
              <Table.HeaderCell textAlign="center" width={4}>
                Status/Action
              </Table.HeaderCell>
              <Table.HeaderCell width={2} textAlign="center">
                Comments
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {permissions.data.map((item, key) => {
              return (
                <Table.Row>
                  <Table.Cell>{item.authority.fullName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Segment basic>
                      <StatusBtn
                        permissionId={item.id}
                        changeStatus={changeStatusDetails}
                        status={item.status}
                        description={item.authority.description}
                      />
                    </Segment>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.status !== "nrq" && (
                      <>
                        <Link to={urlPermissionView(item.id)}>
                          <Button icon="comments" primary />
                        </Link>
                        {item.latestCommentBy === "verifier" && (
                          <Header as="h5" style={{ marginTop: 10 }} color="red">
                            Unread comments
                          </Header>
                        )}
                      </>
                    )}
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

const mapDispatchtoProps = (dispatch) => {
  return {
    getPermissionList: () => {
      dispatch(getPermissionList());
    },
    changeStatusDetails: (newStatus, permissionId) => {
      dispatch(changeStatusDetails(newStatus, permissionId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchtoProps)(SubscriberHome);
