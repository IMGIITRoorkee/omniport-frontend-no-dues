import React, { Component } from "react";
import { connect } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";
import { Dimmer, Loader } from "semantic-ui-react";

import { AppHeader, AppFooter, AppMain, getTheme } from "formula_one";

import Subscriber from "./Subscriber";
import Verifier from "./Verifier";

import { getProfile } from "../actions/getProfile";

import { isVerifier } from "../utils/userRole";

import main from "formula_one/src/css/app.css";
import blocks from "../css/app.css";

class App extends Component {
  componentDidMount() {
    this.props.getProfile();
  }

  render() {
    const creators = [
      {
        name: "Praduman Goyal",
        role: "Full Stack Developer",
        link: "https://pradumangoyal.github.io/"
      },
      {
        name: "Drumil Patel",
        role: "Full Stack developer",
        link: "https://www.github.com/drumilpatel2000",
      },
    ];

    const { profile } = this.props;
    if (profile.isFetching) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }

    return (
      <div styleName="main.app">
        <AppHeader appName="no_dues" mode="app" userDropdown />
        <AppMain>
          <div styleName="main.app-main">
            <Scrollbars autoHide>
              {isVerifier(profile.data) ? (
                <Verifier match={this.props.match} profile={profile.data} />
              ) : (
                <Subscriber match={this.props.match} profile={profile.data} />
              )}
            </Scrollbars>
          </div>
        </AppMain>
        <AppFooter creators={creators} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.getProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => {
      dispatch(getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
