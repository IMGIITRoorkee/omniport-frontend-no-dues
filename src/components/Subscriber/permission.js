import React, { Component } from "react";
import { connect } from "react-redux";

import { Loader, Dimmer, Icon, Divider } from "semantic-ui-react";

import { getPermissionDetail } from "../../actions/getPermissions";

import Conversation from "../Conversation";

import main from "../../css/subscriber.css";

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
      <div className={main["permission-chats"]}>
        <div className={main["name-header"]}>
          <div className={main["header-name-div"]}>
            <Icon color="yellow" name="warning sign" size="large" />
            <h2>Issue Raised by {permission.data.authority.fullName}</h2>
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
