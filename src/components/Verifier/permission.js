import React, { Component } from "react";
import { connect } from "react-redux";

import { Loader, Dimmer, Icon, Divider, Button } from "semantic-ui-react";

import {
  getPermissionDetail,
  changeStatusDetails,
} from "../../actions/getPermissions";

import {
  urlHomeView
} from "../../urls"

import Conversation from "../Conversation";

import main from "../../css/verifier.css";
import common from "../../css/common.css";
import { Link } from "react-router-dom";

export const AppropriateStatusName = (status) => {
  switch (status) {
    case "app":
      return "Approved";
    case "nap":
      return "Not Applicable";
    case "rep":
      return "Issue Raised";
    case "req":
      return "Requested";
  }
};

const AppropriateStatusIcon = (status) => {
  switch (status) {
    case "app":
      return "check";
    case "nap":
      return "cancel";
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
      return "grey";
    case "rep":
      return "yellow";
    case "req":
      return "blue";
  }
};

class Permission extends Component {
  componentDidMount() {
    const { perm_id } = this.props.match.params;
    this.props.getPermissionDetail(perm_id);
  }

  onApproveClick = (permissionId) => {
    this.props.changeStatusDetails("app", permissionId);
  };

  onNotApplicableClick = (permissionId) => {
    this.props.changeStatusDetails("nap", permissionId);
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
    return (
      <>
        <div className={common["back-btn"]} >
          <Link to={urlHomeView()}>
          <Button primary content="Back" icon="arrow left" />
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
              <div className={[common["person-detail"], common["sub-details"]].join(" ")}>
                <h2>{AppropriateStatusName(permission.data.status)}</h2>
                {permission.data.subscriber.personName}
                <br />
                {permission.data.subscriber.personDegree}{" "}
                {permission.data.subscriber.personDepartment}
                <br />
                {permission.data.subscriber.idCard !== null && (
                  <Link to={permission.data.subscriber.idCard}>
                    View ID Card
                  </Link>
                )}
              </div>
            </div>
            {permission.data.status !== "app" &&
              permission.data.status !== "nap" && (
                <div>
                  <Button
                    onClick={() =>
                      this.onNotApplicableClick(permission.data.id)
                    }
                    basic
                    content="Not Applicable"
                  />
                  <Button
                    onClick={() => this.onApproveClick(permission.data.id)}
                    positive
                    icon="check"
                    content="Approve"
                  />
                </div>
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
    changeStatusDetails: (newStatus, permissionId) => {
      dispatch(changeStatusDetails(newStatus, permissionId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
