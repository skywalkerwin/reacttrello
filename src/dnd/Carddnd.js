import React, { Component } from "react";
import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget, DragSource } from "react-dnd";
import { ItemTypes } from "../Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import Taskdnd from "./Taskdnd";
import "../css/Card.css";

const cardSource = {
  canDrag(props) {
    // You can disallow drag based on props
    return true;
  },

  isDragging(props, monitor) {
    // If your component gets unmounted while dragged
    // (like a card in Kanban board dragged between lists)
    // you can implement something like this to keep its
    // appearance dragged:
    return monitor.getItem().id === props.id;
  },

  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    const item = { id: props.id };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();

    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();
    // This is a good place to call some Flux action
    // CardActions.moveCardToList(item.id, dropResult.listId);
  }
};

function dragCollect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
}

const cardTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();

    return { moved: true };
  }
};

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

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
    console.log(this.props);
    const {
      isOver,
      canDrop,
      connectDropTarget,
      isDragging,
      connectDragSource
    } = this.props;
    return connectDragSource(
      connectDropTarget(
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
      )
    );
  }
}

var dropTarget = DropTarget(ItemTypes.TASK, cardTarget, dropCollect)(Carddnd);
export default DragSource(ItemTypes.CARD, cardSource, dragCollect)(dropTarget);
// export default DragSource(ItemTypes.CARD, cardSource, dragCollect)(Carddnd);
