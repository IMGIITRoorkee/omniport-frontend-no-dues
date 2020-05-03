import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Loader, Dimmer, Icon, Divider, Button, Header } from "semantic-ui-react";

import { getPermissionDetail } from "../../actions/getPermissions";

import { urlHomeView } from "../../urls";

import Conversation from "../Conversation";

import main from "../../css/subscriber.css";
import common from "../../css/common.css";

export const AppropriateStatusName = (status) => {
  switch (status) {
    case "app":
      return "Approved by";
    case "nap":
      return "Not Applicable to";
    case "rep":
      return "Issue Raised by";
    case "req":
      return "Requested to";
  }
};

const AppropriateStatusIcon = (status) => {
  switch (status) {
    case "app":
      return "check";
    case "nap":
      return "check";
    case "rep":
      return "warning sign";
    case "req":
      return "clock outline";
  }
};

const AppropriateStatusColor = (status) => {
  switch (status) {
    case "app":
      return "green";
    case "nap":
      return "green";
    case "rep":
      return "yellow";
    case "req":
      return "blue";
  }
};

class SubscriberPermission extends Component {
  componentDidMount() {
    const { perm_id } = this.props.match.params;
    this.props.getPermissionDetail(perm_id);
  }

  render() {
    const { permission } = this.props;

    if (permission.isFetching) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }

    return (
      <>
        <div className={common["back-btn"]}>
          <Link to={urlHomeView()}>
            <Header as='h4'>
              <Icon name="arrow left" />Back
            </Header>
          </Link>
        </div>
        <div className={main["permission-chats"]}>
          <div className={main["name-header"]}>
            <div className={main["header-name-div"]}>
              <Icon
                color={AppropriateStatusColor(permission.data.status)}
                name={AppropriateStatusIcon(permission.data.status)}
                size="large"
              />
              <div>
                <h2>
                  {AppropriateStatusName(permission.data.status)}{" "}
                  {permission.data.authority.fullName}
                </h2>
                <div className={main["gray-text"]}>
                  {permission.data.authority.description}
                </div>
              </div>
            </div>
            <a href={`mailto:${permission.data.authority.email}`}>
              {permission.data.authority.email}
            </a>
          </div>
          <Divider />
          <Conversation
            permissionId={permission.data.id}
            comments={permission.data.comments}
            authority={permission.data.authority}
            subscriber={permission.data.subscriber}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    permission: state.getPermissionDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPermissionDetail: (permissionId) => {
      dispatch(getPermissionDetail(permissionId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriberPermission);
