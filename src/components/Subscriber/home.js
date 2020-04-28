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
      <>
        <Link to={urlPermissionView(permissionId)}>
          <Button basic color="blue">
            <Icon name="comment" /> Go To Comments
          </Button>
        </Link>
        Issue Raised
      </>
    );
  } else {
    return (
      <Header as="h5" color="green">
        <Icon fitted name="check" size="tiny" color="green" /> Approved
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
    console.log(permissions);
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
