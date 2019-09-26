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
        <p className="taskEdit">
          <button
            type="button"
            className="btn btn-default btn-sm"
            // onClick={handleShow}
          >
            {" "}
            Edit
          </button>

          {/* need to implement modal stuff -----------------------------------------------*/}

          {/* <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Task Body</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCardTitle">
                  <Form.Control
                    as="textarea"
                    rows="3"
                    defaultValue={taskBody}
                    type="cardTitle"
                    onChange={e => handleChange(e.target.value)}
                  />
                </Form.Group>
              </Form>
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
        </p>
        <p className="taskContent">
          <h3>{this.props.task.body}</h3>
        </p>
      </div>
    );
  }
}

export default Taskdnd;
