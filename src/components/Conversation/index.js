import React, { Component } from "react";
import { connect } from "react-redux";

import { Scrollbars } from "react-custom-scrollbars";

import { Link } from "react-router-dom";

import moment from "moment";

import { DefaultDP } from "formula_one";

import { commentOnPermission } from "../../actions/getPermissions";
import { Icon, Form, TextArea, Button, Comment } from "semantic-ui-react";

import { isVerifier } from "../../utils/userRole";

import main from "../../css/conversation.css";

class Conversation extends Component {
  state = {
    text: "",
    attachment: null,
  };

  componentDidMount() {
    if (this.scrollbar != undefined) {
      this.scrollbar.scrollToBottom();
    }
  }

  componentDidUpdate() {
    if (this.scrollbar != undefined) {
      this.scrollbar.scrollToBottom();
    }
  }

  fileInputRef = React.createRef();

  addAttachement = (e) => {
    this.setState({
      attachment: e.target.files[0],
    });
  };

  changeText = (e, { value }) => {
    this.setState({
      text: value,
    });
  };

  postComment = () => {
    const { commentOnPermission, permissionId } = this.props;
    commentOnPermission(permissionId, this.state.attachment, this.state.text);
    this.setState({ text: "", attachment: null });
  };

  render() {
    const { comments, authority, subscriber, profile } = this.props;
    return (
      <Comment.Group size="large">
        {comments.map((item, key) => {
          return (
            <Comment className={main["comment"]}>
              <div className={main["profile-pic"]}>
                <DefaultDP
                  name={
                    item.commenter.id === subscriber.person
                      ? subscriber.personName
                      : authority.fullName
                  }
                />
              </div>
              <Comment.Content>
                <Comment.Author>
                  {item.commenter.id === subscriber.person
                    ? subscriber.personName
                    : authority.fullName}
                </Comment.Author>
                <Comment.Metadata>
                  {moment(item.datetimeCreated).fromNow()}
                </Comment.Metadata>
                <Comment.Text>
                  <p> {item.text} </p>
                  {item.attachment !== null && (
                    <Link
                      to={item.attachment}
                      onClick={(event) => {
                        event.preventDefault();
                        window.open(item.attachment);
                      }}
                    >
                      {" "}
                      <Button
                        color="blue"
                        basic
                        content="View Attachement"
                        icon="file"
                      />
                    </Link>
                  )}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          );
        })}
        <Comment className={main["comment"]}>
          <div className={main["profile-pic"]}>
            <DefaultDP
              name={
                isVerifier(profile.data)
                  ? profile.data.authority.fullName
                  : profile.data.personName
              }
            />
          </div>
          <Comment.Content className={main["comment-form"]}>
            <Comment.Author>
              {isVerifier(profile.data)
                ? profile.data.authority.fullName
                : profile.data.personName}
            </Comment.Author>
            <Form>
              <TextArea value={this.state.text} onChange={this.changeText} />
              <div className={main["post-buttons"]}>
                {this.state.attachment !== null && (
                  <Icon color="green" size="large" name="check circle" />
                )}
                <Button
                  primary
                  onClick={() => this.fileInputRef.current.click()}
                >
                  <Icon name="upload" /> Upload a file
                </Button>
                <input
                  ref={this.fileInputRef}
                  type="file"
                  hidden
                  onChange={this.addAttachement}
                />
                <Button onClick={this.postComment} positive>
                  <Icon name="paper plane" /> Send
                </Button>
              </div>
            </Form>
          </Comment.Content>
        </Comment>
      </Comment.Group>
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
    commentOnPermission: (permissionId, attachment, text) => {
      dispatch(commentOnPermission(permissionId, attachment, text));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);