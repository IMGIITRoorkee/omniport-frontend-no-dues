import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route, Switch, Redirect } from "react-router-dom";

import VeriferHome from "./home";
import Permission from "./permission";
import SubscriberDetail from "./subscriberDetail";

import common from "../../css/common.css";
import { Divider, Button, Icon, Modal } from "semantic-ui-react";

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

class ViewInstructions extends Component {
  state = {
    modalOpen: false
  }

  openModal = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({
      modalOpen: false
    })
  }

  httpHtml = content => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
    return content
      ? content.replace(reg, "<a href='$1$2' target='_blank'>$1$2</a>")
      : 'Instructions are not updated.'
  }

  render() {
    return (
      <Modal
        trigger={<Button onClick={this.openModal} > <Icon name='info' /> View uploaded instructions</Button>}
        open={this.state.modalOpen}
      >
        <Modal.Header>Instructions</Modal.Header>
        <Modal.Content
          style={{ whiteSpace: 'pre-line' }}
          dangerouslySetInnerHTML={{
            __html: this.httpHtml(this.props.description)
          }}
        />
        <Modal.Actions>
          <Button as='a' href='https://forms.gle/Sp9d3ro3KSUCre3s6' target='_blank' primary>Update instructions</Button>
          <Button onClick={this.closeModal} content='Close' icon />
        </Modal.Actions>
      </Modal>
    )
  }
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
          <div>
            <ViewInstructions
              description={profile.authority.description}
            />
            <Button
              as='a'
              href='https://www.iitr.ac.in/Main/uploads/File/website%20support/OnlineNoDueProcessExplained.pdf'
              target='_blank'>
              <Icon name='question' />
            Verifier Manual
          </Button>
          </div>
        </div>
        <Divider styleName="common.common-divider" />
        <MainComponent profile={profile} match={match} />
      </div>
    );
  }
}

export default connect(null, null)(Verifer);
