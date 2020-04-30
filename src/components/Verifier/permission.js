import React, { Component } from "react";
import { connect } from "react-redux";

import main from "../../css/verifier.css";

class Permission extends Component {
  render() {
    return <h1>Permission</h1>;
  }
}

export default connect(null, null)(Permission);
