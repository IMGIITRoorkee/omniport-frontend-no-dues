import React, { Component } from "react";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { uploadIDCard } from "../../actions/uploadIDCard";

import { Button, Icon, Divider } from "semantic-ui-react";

import SubscriberHome from "./home";
import IdentityCardUpload from "./identityCardUpload";
import HostelUploads from "./hostelUploads";
import Permission from "./permission";

import common from "../../css/common.css";

function MainComponent({ profile, match }) {
  if (profile.idCard === null) {
    return <IdentityCardUpload match={match} />;
  } else if (!profile.requiredAuthoritiesSelected) {
    return <HostelUploads />;
  } else {
    return (
      <Switch>
        <Route exact path={`${match.path}`} component={SubscriberHome} />
        <Route
          path={`${match.path}permission/:perm_id/`}
          component={Permission}
        />
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
    );
  }
}

class Subscriber extends Component {
  fileInputRef = React.createRef();

  addIDCard = (e) => {
    this.props.uploadIDCard(e.target.files[0]);
  };

  render() {
    const { profile, match } = this.props;
    return (
      <div className={common["main-div"]}>
        <div styleName="common.person-header">
          <div styleName="common.person-detail">
            Name: {profile.personName}
            <br />
            Enrollment No: {profile.personEnrolment}
            <br />
            Branch: {profile.personDepartment}
	    {
               profile.noDue &&
	    (<b>
	      <br />
    	      <Icon name='check circle outline' color='green'/>
	      You have obtained no dues slip from all of the required departments. Further process will be handled by the Academic section.
	    </b>)
	    }
          </div>
          <div styleName="common.upload">
            {profile.idCard !== null && (
              <div styleName="common.upload-card">
                <Link
                  to={profile.idCard}
                  onClick={(event) => {
                    event.preventDefault();
                    window.open(profile.idCard);
                  }}
                >
                  View Uploaded{" "}
                </Link>{" "}
                <Icon name="id card" />
              </div>
            )}{" "}
            <Button title="Upload Image" primary onClick={() => this.fileInputRef.current.click()}>
              <Icon name="upload" size="large" /> Upload ID Card{" "}
            </Button>
            <input
              ref={this.fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={this.addIDCard}
            />
          </div>
        </div>
        <Divider styleName="common.common-divider" />
        <MainComponent profile={profile} match={match} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadIDCard: (idCardFile) => {
      dispatch(uploadIDCard(idCardFile));
    },
  };
};

export default connect(null, mapDispatchToProps)(Subscriber);
