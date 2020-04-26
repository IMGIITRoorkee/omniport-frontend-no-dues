import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Divider, Button, Icon } from "semantic-ui-react";

import common from "../../css/common.css";

class Subscriber extends Component {
  fileInputRef = React.createRef();

  addIDCard = (e) => {
    console.log(e.target.files[0]);
  };

  render() {
    const { profile } = this.props;
    return (
      <div>
        <div styleName="common.person-header">
          <div styleName="common.person-detail">
            Name :- {profile.personName}
            <br />
            Enrollment No :- {profile.personEnrolment}
            <br />
            Branch :- {profile.personDepartment}
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
            <Button primary onClick={() => this.fileInputRef.current.click()}>
              <Icon name="upload" size="large" /> Upload ID Card{" "}
            </Button>
            <input
              ref={this.fileInputRef}
              type="file"
              hidden
              onChange={this.addIDCard}
            />
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default connect(null, null)(Subscriber);
