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
      <div className="cardBody">
        <h2 className="cardTitle">{this.props.card.title}</h2>
        <a className="cardEdit">
          <button
            // onClick={handleShow}
            type="button"
            className="btn btn-default btn-sm"
          >
            Edit
          </button>
        </a>
        {this.drawTasks(this.props.card.tasks)}
        <div>
          <Button
            className="cardAddTask"
            variant="secondary"
            // onClick={handleShowTask}
            type="button"
          >
            + Add Task
          </Button>
        </div>

        {/* <Modal show={showTaskModal} onHide={handleCloseTask}>
            <Modal.Header closeButton>
              <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCardTitle">
                  <Form.Control
                    as="textarea"
                    rows="3"
                    type="cardTitle"
                    placeholder={"Add Task"}
                    onChange={e => handleChangeTask(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseTask}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmitTask}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal> */}
        {/* {------------------------------------------------------------------------------------------------------------------------------} */}
        {/* <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Card Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <Form.Group controlId="formCardTitle">
                  <Form.Control
                    // autofocus="true"
                    type="cardTitle"
                    defaultValue={cardTitle}
                    onChange={e => handleChange(e.target.value)}
                    // ref={textInput}
                  />
                </Form.Group>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal> */}
      </div>
    );
  }
}

export default Carddnd;
