import React, { Component } from "react";
import { connect, batch } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { uploadIDCard } from "../../actions/uploadIDCard";

import main from "../../css/subscriber.css";
import common from "../../css/common.css";

class IdentityCardUpload extends Component {
  fileInputRef = React.createRef();

  addIDCard = (e) => {
    console.log(e.target.files[0]);
    this.props.uploadIDCard(e.target.files[0]);
  };
  render() {
    return (
      <div className={main["main-content"]}>
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
