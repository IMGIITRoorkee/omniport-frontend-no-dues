import React, { Component } from "react";

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

import { getPermissionList } from "../../actions/getPermissions";

import main from "../../css/subscriber.css";

const StatusBtn = ({ status }) => {
  if (status === "nrq") {
    return (
      <Button basic color="grey">
        <Icon name="paper plane" /> Ask For Approval
      </Button>
    );
  } else if (status === "req") {
    return (
      <Header as="h5" color="blue">
        <Icon fitted name="info circle" size="tiny" color="blue" /> Requested
      </Header>
    );
  } else if (status === "rep") {
    return (
      <>
        <Button basic color="yellow">
          <Icon name="warning sign" /> Check Comments
        </Button>
        <Popup
          position="top left"
          content="There is an issue raised by the verifier, please check comments"
          trigger={<Icon name="question" />}
        />
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
    const { permissions } = this.props;
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
                    <StatusBtn status={item.status} />
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
  };
};

export default connect(mapStateToProps, mapDispatchtoProps)(SubscriberHome);
