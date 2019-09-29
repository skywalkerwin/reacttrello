import React, { Component } from "react";
import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget, DragSource } from "react-dnd";
import { ItemTypes } from "../Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import "../css/Task.css";

const taskSource = {
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
    // console.log("IS DRAGGING");
    // Return the data describing the dragged item
    const item = { id: "task" };
    return item;
  },

  endDrag(props, monitor, component) {
    // console.log("end drag test");
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      console.log("task drop test");
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();
    console.log(item);
    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();
    console.log(dropResult);
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

const taskTarget = {
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

class Taskdnd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isOver,
      canDrop,
      connectDropTarget,
      isDragging,
      connectDragSource
    } = this.props;

    return connectDragSource(
      connectDropTarget(
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
      )
    );
  }
}

// export default Taskdnd;
var TaskDropTarget = DropTarget(ItemTypes.TASK, taskTarget, dropCollect)(
  Taskdnd
);
export default DragSource(ItemTypes.TASK, taskSource, dragCollect)(
  TaskDropTarget
);
