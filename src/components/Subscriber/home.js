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
} from "semantic-ui-react";

import { connect } from "react-redux";

import { urlPermissionView } from "../../urls";

import {
  getPermissionList,
  changeStatusDetails,
} from "../../actions/getPermissions";

import main from "../../css/subscriber.css";

const StatusBtn = ({ status, changeStatus, permissionId }) => {
  if (status === "nrq") {
    return (
      <Button
        onClick={() => changeStatus("req", permissionId)}
        basic
        color="grey"
      >
        <Icon name="paper plane" /> Ask For Approval
      </Button>
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
      <Header as="h5" color="grey">
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
              <Table.HeaderCell width={12}>Authority</Table.HeaderCell>
              <Table.HeaderCell textAlign="center" width={4}>
                Status/Action
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" >Comments</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {permissions.data.map((item, key) => {
              return (
                <Table.Row>
                  <Table.Cell>{item.authority.fullName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <StatusBtn
                      permissionId={item.id}
                      changeStatus={changeStatusDetails}
                      status={item.status}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.status !== "nrq" && (
                      <Link to={urlPermissionView(item.id)}>
                        <Button icon="comments" primary />
                      </Link>
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
