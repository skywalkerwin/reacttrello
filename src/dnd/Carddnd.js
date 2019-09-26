import React, { Component } from "react";
import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { ItemTypes } from "../Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import Taskdnd from "./Taskdnd";
import "../css/Card.css";

class Carddnd extends Component {
  constructor(props) {
    super(props);
    this.drawTasks = this.drawTasks.bind(this);
    this.state = {};
  }
  drawTasks(tasks) {
    var taskList = [];
    if (this.props.card !== undefined && tasks !== undefined) {
      Array.from(tasks).forEach(t => {
        taskList.push(<Taskdnd task={t} />);
      });
    }
    return taskList;
  }
  render() {
    return (
      <div
        // style={{ backgroundColor: "rgba(200, 200, 255, 1)" }}
        className="cardBody"
      >
        {/* {this.props.card} */}
        <h2 className="cardTitle">{this.props.card.title}</h2>
        {this.drawTasks(this.props.card.tasks)}
        {/* {console.log(this.props.card)}
        {console.log(this.props.card.tasks)} */}
      </div>
    );
  }
}

export default Carddnd;
