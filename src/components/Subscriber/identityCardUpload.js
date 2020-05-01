import React, { Component } from "react";
import { connect, batch } from "react-redux";
import { Button, Icon, Segment } from "semantic-ui-react";

import { uploadIDCard } from "../../actions/uploadIDCard";

import main from "../../css/subscriber.css";
import common from "../../css/common.css";

class IdentityCardUpload extends Component {
  fileInputRef = React.createRef();

  addIDCard = (e) => {
    this.props.uploadIDCard(e.target.files[0]);
  };
  render() {
    return (
      <div className={main["id-card"]}>
        <Segment className={main["main-segment"]} raised>
          <h3>You need to upload your institute ID card to proceed</h3>
          <Button
            size="large"
            primary
            onClick={() => this.fileInputRef.current.click()}
          >
            <Icon name="upload" size="large" /> Upload ID Card{" "}
          </Button>
          <input
            ref={this.fileInputRef}
            type="file"
            hidden
            onChange={this.addIDCard}
          />
        </Segment>
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

export default connect(null, mapDispatchToProps)(IdentityCardUpload);
