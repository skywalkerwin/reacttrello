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
    return monitor.getItem().task.taskID === props.task.taskID;
  },

  beginDrag(props, monitor, component) {
    // console.log(props);
    // console.log("IS DRAGGING");
    // Return the data describing the dragged item
    const item = { id: "task", task: props.task };
    return item;
  },

  endDrag(props, monitor, component) {
    console.log("end drag test");
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      console.log("task drop test");
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();
    // consol.e.log(item);
    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();
    console.log("drop result:", dropResult);
    console.log(item.task.taskID);
    if (dropResult.droppedOn === "Trash") {
      var formdata = new FormData();
      formdata.set("taskID", item.task.taskID);
      axios({
        method: "post",
        url: "http://127.0.0.1:5000/deleteTask",
        data: formdata
      })
        .then(res => {
          console.log(res);
          props.handleDelete(item.task.taskID);
        })
        .catch(err => console.log(err));
    }
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
  hover(props, monitor, component) {
    // console.log("HOVERING OVER TASK");
    const coff = monitor.getClientOffset();
    const item = monitor.getItem();
    // console.log(item.task.body);
    // console.log(item, coff);
    // console.log(component.state.mid);
    // console.log(component.taskRef.current.getBoundingClientRect());
    if (item.id == "task") {
      if (item.task.taskID !== props.task.taskID) {
        if (coff.y > component.state.mid) {
          // console.log("HOVERED BELOW");
          component.props.handleHover(false, item.task, props.task.taskID);
        } else if (coff.y <= component.state.mid) {
          // console.log("HOVERED ABOVE");
          component.props.handleHover(true, item.task, props.task.taskID);
        }
      }
    }
  },
  drop(props, monitor, component) {
    console.log("DROPPED ON TASK");
    if (monitor.didDrop()) {
      return;
    }
    const coff = monitor.getClientOffset();
    const item = monitor.getItem();
    const dropRes = monitor.getDropResult();
    console.log("dropped ID", item.task.taskID);
    console.log("DROPPED ON ID:", props.task.taskID);
    if (item.id == "task") {
      // if (item.task.taskID !== props.task.taskID) {
      if (coff.y > component.state.mid) {
        component.props.handleDrop(false, item.task, props.task.taskID);
      } else if (coff.y <= component.state.mid) {
        component.props.handleDrop(true, item.task, props.task.taskID);
      }
      // }
    }
    return { droppedOn: "task", moved: true };
  }
};

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    // canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class Taskdnd extends Component {
  constructor(props) {
    super(props);
    this.taskRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.state = {
      parentCardID: this.props.parentCardID,
      task: this.props.task,
      taskID: this.props.task.taskID,
      show: false,
      temp: this.props.temp,
      tempBody: this.props.task.body,
      taskBody: this.props.task.body,
      taskOrder: this.props.task.taskOrder
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.task.taskID !== prevProps.task.taskID) {
      const newTask = JSON.parse(JSON.stringify(this.props.task));
      this.setState({
        parentCardID: this.props.parentCardID,
        task: this.props.task,
        taskID: this.props.task.taskID,
        tempBody: this.props.task.body,
        taskBody: this.props.task.body
      });
    }
  }
  componentDidMount() {
    const pos = this.taskRef.current.getBoundingClientRect();
    this.setState({
      mid: pos.top + pos.height / 2
    });
  }

  handleChange(e) {
    this.setState({
      tempBody: e
    });
  }
  handleShow() {
    this.setState({
      show: !this.state.show
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      taskBody: this.state.tempBody,
      show: !this.state.show
    });
    var formdata = new FormData();
    formdata.set("body", this.state.tempBody);
    formdata.set("taskID", this.state.task.taskID);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/updateTask",
      data: formdata
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }
  render() {
    const {
      isOver,
      canDrop,
      connectDropTarget,
      isDragging,
      connectDragSource
    } = this.props;
    const opacity = isDragging ? 1 : 1;
    const backgroundColor = isDragging ? "yellow" : "white";
    // if (isDragging && this.state.task.cardID === this.state.parentCardID) {
    //   return null;
    // }
    return connectDragSource(
      connectDropTarget(
        <div
          ref={this.taskRef}
          style={{ backgroundColor, opacity }}
          className="task"
        >
          <p className="taskEdit">
            <button
              type="button"
              className="btn btn-default btn-sm"
              onClick={this.handleShow}
            >
              Edit
            </button>
            <Modal show={this.state.show} onHide={this.handleShow}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Task Body</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={e => this.handleSubmit(e)}>
                  <Form.Group controlId="formCardTitle">
                    <Form.Control
                      as="textarea"
                      rows="3"
                      defaultValue={this.state.taskBody}
                      type="cardTitle"
                      onChange={e => this.handleChange(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleShow}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleSubmit}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </p>
          <div className="taskContent">
            <h2 style={{ textAlign: "center" }}>{this.state.taskOrder}</h2>
            <h4>{this.state.taskBody}</h4>
          </div>
        </div>
      )
    );
  }
}

var TaskDropTarget = DropTarget(ItemTypes.TASK, taskTarget, dropCollect)(
  Taskdnd
);
export default DragSource(ItemTypes.TASK, taskSource, dragCollect)(
  TaskDropTarget
);
