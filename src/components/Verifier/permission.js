import React, { Component } from "react";
import { connect } from "react-redux";

import { Loader, Dimmer, Icon, Divider, Button } from "semantic-ui-react";

import {
  getPermissionDetail,
  changeStatusDetails,
} from "../../actions/getPermissions";

import Conversation from "../Conversation";

import main from "../../css/verifier.css";
import common from "../../css/common.css";
import { Link } from "react-router-dom";

class Permission extends Component {
  componentDidMount() {
    const { perm_id } = this.props.match.params;
    this.props.getPermissionDetail(perm_id);
  }

  onApproveClick = (permissionId) => {
    this.props.changeStatusDetails(permissionId);
  };

  render() {
    const { permission } = this.props;

    if (permission.isFetching) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }
    console.log(permission.data);
    return (
      <div className={main["permission-chats"]}>
        <div className={main["name-header"]}>
          <div className={main["header-name-div"]}>
            <Icon color="yellow" name="warning sign" size="large" />
            <div className={common["person-detail"]}>
              <h2>Issue Raised for</h2>
              {permission.data.subscriber.personName}
              <br />
              {permission.data.subscriber.personDegree}{" "}
              {permission.data.subscriber.personDepartment}
              <br />
              {permission.data.subscriber.idCard !== null && (
                <Link to={permission.data.subscriber.idCard}>View ID Card</Link>
              )}
            </div>
          </div>
          {permission.data.status !== "app" && (
            <Button
              onClick={() => this.onApproveClick(permission.data.id)}
              positive
              icon="check"
              content="Approve"
            />
          )}
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
    changeStatusDetails: (permissionId) => {
      dispatch(changeStatusDetails("app", permissionId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
