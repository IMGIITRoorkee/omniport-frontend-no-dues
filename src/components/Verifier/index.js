import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route, Switch, Redirect } from "react-router-dom";

import VeriferHome from "./home"
import Permission from "./permission"

import common from "../../css/common.css";

function MainComponent({profile, match}) {
  return (
    <Switch>
        <Route exact path={`${match.path}`} component={VeriferHome} />
        <Route
          path={`${match.path}permission/:perm_id/`}
          component={Permission}
        />
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
  )
}

class Verifer extends Component {
  render() {
    const { profile, match } = this.props;
    console.log(profile);
    return (
      <div className={common["main-div"]}>
        <div styleName="common.person-header">
          <div styleName="common.person-detail">
            Name: {profile.person.fullName}
            <br />
            Authority: {profile.authority.fullName}
          </div>
        </div>
        <MainComponent profile={profile} match={match} />
      </div>
    );
  }
}

export default connect(null, null)(Verifer);
