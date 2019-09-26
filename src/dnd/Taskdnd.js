import React, { Component } from "react";
import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { ItemTypes } from "../Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import "../css/Task.css";

class Taskdnd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="task">
        <p className="taskContent">
          <h3>{this.props.task.body}</h3>
        </p>
      </div>
    );
  }
}

export default Taskdnd;
