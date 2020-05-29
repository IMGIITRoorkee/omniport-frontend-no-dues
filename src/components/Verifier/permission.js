import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  Loader,
  Dimmer,
  Icon,
  Divider,
  Button,
  Header,
} from "semantic-ui-react";

import {
  getPermissionDetail,
  changeStatusDetails,
} from "../../actions/getPermissions";

import { urlHomeView } from "../../urls";

import Conversation from "../Conversation";

import main from "../../css/verifier.css";
import common from "../../css/common.css";

export const AppropriateStatusName = (status) => {
  switch (status) {
    case "app":
      return "Approved";
    case "apc":
      return "Approved on Condition";
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
    case "apc":
      return "check circle outline";
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
    case "apc":
      return "green";
    case "nap":
      return "green";
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

  onApproveOnConditionClick = (permissionId) => {
    this.props.changeStatusDetails("apc", permissionId);
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
        <div className={common["back-btn"]}>
          <Link to={urlHomeView()}>
            <Header as="h4">
              <Icon name="arrow left" />
              Back
            </Header>
          </Link>
        </div>
        <div className={main["permission-chats"]}>
          <div className={main["name-header"]}>
            <div>
              <div className={main["header-name-div"]}>
                <Icon
                  color={AppropriateStatusColor(permission.data.status)}
                  name={AppropriateStatusIcon(permission.data.status)}
                  size="large"
                />
                <div
                  className={[
                    common["person-detail"],
                    common["sub-details"],
                  ].join(" ")}
                >
                  <h2>{AppropriateStatusName(permission.data.status)}</h2>
                  {permission.data.subscriber.personName}
                  <br />
                  {permission.data.subscriber.personDegree}{" "}
                  {permission.data.subscriber.personDepartment}
                  <br />
                  {permission.data.subscriber.idCard !== null && (
                    <a href={permission.data.subscriber.idCard} target="_blank">
                      View ID Card
                    </a>
                  )}
                </div>
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
                  {permission.status !== 'apc' && (
                    <Button
                      onClick={() =>
                        this.onApproveOnConditionClick(permission.data.id)
                      }
                      basic
                      positive
                      content="Approve on Condition"
                    />
                   )}
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
            isCommenting={permission.isCommenting}
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
