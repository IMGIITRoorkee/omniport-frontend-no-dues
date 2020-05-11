import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route, Switch, Redirect } from "react-router-dom";

import VeriferHome from "./home";
import Permission from "./permission";
import SubscriberDetail from "./subscriberDetail";

import common from "../../css/common.css";
import { Divider } from "semantic-ui-react";

function MainComponent({ match }) {
  return (
    <Switch>
      <Route exact path={`${match.path}`} component={VeriferHome} />
      <Route
        path={`${match.path}permission/:perm_id/`}
        component={Permission}
      />
      <Route path={`${match.path}subscriber`} component={SubscriberDetail} />
      <Route render={() => <Redirect to="/404" />} />
    </Switch>
  );
}

class Verifer extends Component {
  render() {
    const { profile, match } = this.props;
    return (
      <div className={common["main-div"]}>
        <div styleName="common.person-header">
          <div styleName="common.person-detail">
            Name: {profile.personName}
            <br />
            Authority: {profile.authority.fullName}
          </div>
        </div>
        <Divider styleName="common.common-divider" />
        <MainComponent profile={profile} match={match} />
      </div>
    );
  }
}

export default connect(null, null)(Verifer);
