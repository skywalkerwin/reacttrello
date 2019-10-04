import React, { Component } from "react";
import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget, DragSource } from "react-dnd";
import { ItemTypes } from "../Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
// import Taskdnd from "./Taskdnd";
import TaskDropTarget from "./Taskdnd";
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
    return monitor.getItem().card.cardID === props.card.cardID;
  },

  beginDrag(props, monitor, component) {
    // console.log("IS DRAGGING");
    // Return the data describing the dragged item
    const item = { id: "Card", card: props.card };
    return item;
  },

  endDrag(props, monitor, component) {
    // console.log("end drag test");
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();
    // console.log(item);
    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();
    // console.log("endDrag card", dropResult);
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
  hover(props, monitor, component) {
    const coff = monitor.getClientOffset();
    const item = monitor.getItem();
    if (item.id === "Task") {
      const tempTask = {
        boardID: item.task.boardID,
        body: item.task.body,
        cardID: item.task.cardID,
        created: item.task.created,
        taskID: item.task.taskID,
        taskOrder: 1,
        temp: true
      };

      if (component.state.tasks.length < 1) {
        component.setState({
          hasTemp: true,
          tasks: [tempTask]
        });
      } else {
        const pos = component.cardRef.current.getBoundingClientRect();
        if (coff.y < pos.top + 55) {
          const topTask = component.state.tasks.filter(
            t => t.taskOrder === 1
          )[0];
          component.dragTask(true, item.task, topTask.taskID);
        } else if (coff.y > pos.bottom - 63) {
          const botTask = component.state.tasks.filter(
            t => t.taskOrder === component.state.tasks.length
          )[0];
          component.dragTask(false, item.task, botTask.taskID);
        }
      }
    }
    //   topLine: pos.top + 45,
    //   botLine: pos.bottom - 50
    // console.log(coff);
    // const pos = component.cardRef.current.getBoundingClientRect();
    // if (coff.y < pos.top + 55) {
    //   console.log("ABOVE");
    // } else if (coff.y > pos.bottom - 63) {
    //   console.log("BELOW");
    // }
  },
  drop(props, monitor, component) {
    const coff = monitor.getClientOffset();
    const item = monitor.getItem();
    if (monitor.didDrop()) {
      console.log("--------------DID DROP ON CARD--------------");
      return;
    }
    console.log("------CARD DROP FUNCTION--------");
    const pos = component.cardRef.current.getBoundingClientRect();
    if (coff.y < pos.top + 55) {
      const topTask = component.state.tasks.filter(t => t.taskOrder === 1)[0];
      component.dropTask(true, item.task, topTask.taskID);
    } else if (coff.y > pos.bottom - 63) {
      const topTask = component.state.tasks.filter(
        t => t.taskOrder === component.state.tasks.length
      )[0];
      component.dropTask(false, item.task, topTask.taskID);
    }
    // console.log("DROPPED ON CARD");
    return { droppedOn: "Card", cardID: component.state.cardID, moved: true };
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
    this.cardRef = React.createRef();
    this.alterTasks = this.alterTasks.bind(this);
    this.drawTasks = this.drawTasks.bind(this);
    this.dragTask = this.dragTask.bind(this);
    this.dropTask = this.dropTask.bind(this);
    this.hoverTask = this.hoverTask.bind(this);
    this.endDragTask = this.endDragTask.bind(this);

    this.handleChangeEdit = this.handleChangeEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.handleShowEdit = this.handleShowEdit.bind(this);
    this.handleChangeTask = this.handleChangeTask.bind(this);
    this.handleSubmitTask = this.handleSubmitTask.bind(this);
    this.handleShowTask = this.handleShowTask.bind(this);
    this.state = {
      card: this.props.card,
      boardID: this.props.card.boardID,
      cardID: this.props.card.cardID,
      hasTemp: false,
      numTasks: this.props.card.numTasks,
      showEdit: false,
      showTask: false,
      tempTask: "",
      tempTitle: this.props.card.title,
      title: this.props.card.title,
      tasks: this.props.card.tasks
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isOver && this.state.hasTemp == true) {
      // console.log("NOT OVER");
      const oldTasks = this.state.tasks.filter(t => t.temp != true);
      this.setState({ hasTemp: false, tasks: oldTasks });
    }
    // if (prevState.tasks !== this.state.tasks) {
    //   console.log("different Tasks");
    // }
    if (
      this.props.card.cardID !== prevProps.card.cardID ||
      this.props.card.tasks !== prevProps.card.tasks
    ) {
      const newCard = JSON.parse(JSON.stringify(this.props.card));
      const newTasks = newCard.tasks.filter(t => t.temp !== true);
      this.setState({
        card: newCard,
        cardID: newCard.cardID,
        numTasks: newCard.numTasks,
        tempTitle: newCard.title,
        title: newCard.title,
        tasks: newTasks
      });
    }
  }

  componentDidMount() {
    // const pos = this.cardRef.current.getBoundingClientRect();
    // this.setState({
    //   pos: pos,
    //   height: pos.height,
    //   mid: pos.top + pos.height / 2,
    //   topLine: pos.top + 45,
    //   botLine: pos.bottom - 50
    // });
  }

  alterTasks(tid) {
    const newTasks = this.state.tasks.filter(t => t.taskID !== tid);
    this.setState({
      tasks: newTasks,
      numTasks: this.state.numTasks - 1
    });
  }
  dragTask(task) {
    // console.log("---- IN CARD's DRAG TASK HANDLER");
    // console.log("Task:", task.task);
    var newTasks = this.state.tasks.filter(t => t.taskID !== task.taskID);
    newTasks.forEach(t => {
      if (t.taskOrder > task.taskOrder) {
        t.taskOrder = t.taskOrder - 1;
      }
    });
    this.setState({
      tasks: newTasks
    });
  }
  dropTask(above, temp, tid) {
    console.log("TASK WAS DROPPED...HANDLING");
    console.log(above, temp, tid);
    //if there are no previous tasks on card
    if (tid === undefined) {
      console.log("NO TASK ON CARD YET");
      const firstTask = {
        boardID: temp.boardID,
        body: temp.body,
        cardID: this.state.cardID,
        created: temp.created,
        taskID: temp.taskID,
        taskOrder: 1
      };
      this.setState({
        tasks: [firstTask]
      });
      return;
    }
    const overTask = this.state.tasks.filter(t => t.taskID === tid)[0]; //dropped on this task
    if (temp.taskID === tid) {
      //checking if dropped task is dropping on temp task that was added
      var sameTasks = this.state.tasks; //setting up new list with updated dropped task
      sameTasks.forEach(t => {
        if (t.taskID === tid) {
          t.temp = false; //task is no longer temp (for rendering)
          t.cardID = this.state.cardID; //changing cardID of dropped task
        }
      });
      var counter = 1; //updating taskOrders with new task addition
      sameTasks.forEach(t => {
        t.taskOrder = counter;
        counter = counter + 1;
      });
      this.setState({ hasTemp: false, tasks: sameTasks }); //se hasTemp to false with new tasks
      return;
    }
    const oldTasks = this.state.tasks.filter(t => t.taskID !== temp.taskID);
    const overOrder = overTask.taskOrder;
    const draggedTask = {
      boardID: temp.boardID,
      body: temp.body,
      cardID: this.state.cardID,
      created: temp.created,
      taskID: temp.taskID,
      taskOrder: overOrder
    };
    var newTasks = [];
    oldTasks.forEach(t => {
      if (t.taskOrder >= overOrder) {
        if (above == false) {
          newTasks.push(t);
        }
        if (t.taskOrder == overOrder) {
          newTasks.push(draggedTask);
        }
        if (above == true) {
          newTasks.push(t);
        }
      } else {
        newTasks.push(t);
      }
    });
    var counter = 1;
    newTasks.forEach(t => {
      t.taskOrder = counter;
      counter = counter + 1;
    });
    //AXIOS
    this.setState({
      tasks: newTasks
    });
  }
  hoverTask(above, temp, tid) {
    const oldTasks = this.state.tasks.filter(t => t.taskID !== temp.taskID);
    const overTask = this.state.tasks.filter(t => t.taskID === tid)[0];
    const overOrder = overTask.taskOrder;
    const draggedTask = {
      boardID: temp.boardID,
      body: temp.body,
      cardID: temp.cardID,
      created: temp.created,
      taskID: temp.taskID,
      taskOrder: overOrder,
      temp: true
    };
    var newTasks = [];
    oldTasks.forEach(t => {
      if (t.taskOrder >= overOrder) {
        if (above == false) {
          newTasks.push(t);
        }
        if (t.taskOrder == overOrder) {
          newTasks.push(draggedTask);
        }
        if (above == true) {
          newTasks.push(t);
        }
      } else {
        newTasks.push(t);
      }
    });
    var counter = 1;
    newTasks.forEach(t => {
      t.taskOrder = counter;
      counter = counter + 1;
    });
    this.setState({
      hasTemp: true,
      tasks: newTasks
    });
  }
  drawTasks(over, tasks) {
    const oldTasks = over === true ? tasks : tasks.filter(t => t.temp !== true);
    var taskList = [];
    if (this.state.card !== undefined && oldTasks !== undefined) {
      Array.from(oldTasks).forEach(t => {
        taskList.push(
          <TaskDropTarget
            key={t.taskID}
            parentCardID={this.state.cardID}
            task={t}
            handleDelete={this.alterTasks}
            handleHover={this.hoverTask}
            handleDrop={this.dropTask}
            handleDrag={this.dragTask}
            handleEndDrag={this.endDragTask}
          />
        );
      });
    }
    return taskList;
  }
  endDragTask(task) {
    console.log("--------IN CARD END DRAG-----------");
    // console.log("dragged task", task);
    console.log("TRYING TO REMOVE FROM cardID:", this.state.cardID);
    // console.log("CARD HANDLING END DRAG");
    // if (task.cardID !== this.state.cardID) {
    const newTasks = this.state.tasks.filter(t => t.taskID !== task.taskID);
    this.setState({
      tasks: newTasks
    });
    // }
    console.log(
      "----------------------------------END DRAG-------------------------------------"
    );
  }

  handleChangeEdit(e) {
    this.setState({
      tempTitle: e
    });
  }
  handleShowEdit() {
    this.setState({
      showEdit: !this.state.showEdit
    });
  }
  handleSubmitEdit(e) {
    e.preventDefault();
    this.setState({
      title: this.state.tempTitle,
      showEdit: !this.state.showEdit
    });
    var formdata = new FormData();
    formdata.set("title", this.state.tempTitle);
    formdata.set("cardID", this.state.cardID);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/updateCard",
      data: formdata
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }
  handleChangeTask(e) {
    this.setState({
      tempTask: e
    });
  }
  handleShowTask() {
    this.setState({
      showTask: !this.state.showTask
    });
  }
  handleSubmitTask(e) {
    e.preventDefault();
    this.handleShowTask();
    var formdata = new FormData();
    formdata.set("boardID", this.state.boardID);
    formdata.set("body", this.state.tempTask);
    formdata.set("cardID", this.state.cardID);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/addTask",
      data: formdata
    })
      .then(res => {
        console.log(res);
        const extraTask = {
          boardID: res.data.boardID,
          body: res.data.body,
          cardID: res.data.cardID,
          created: res.data.created,
          taskID: res.data.taskID,
          taskOrder: res.data.numTasks
        };
        this.setState({
          tasks: [...this.state.tasks, extraTask],
          numTasks: this.state.numTasks + 1
        });
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
    const opacity = isDragging ? 0.2 : 1;
    return connectDragSource(
      connectDropTarget(
        <div ref={this.cardRef} style={{ opacity }} className="cardBody">
          <h2 className="cardTitle">{this.state.title}</h2>
          {/* <h3>{this.state.cardID}</h3> */}
          <a className="cardEdit">
            <button
              onClick={this.handleShowEdit}
              type="button"
              className="btn btn-default btn-sm"
            >
              Edit
            </button>
          </a>
          {this.drawTasks(isOver, this.state.tasks)}
          <div>
            <Button
              className="cardAddTask"
              variant="secondary"
              onClick={this.handleShowTask}
              type="button"
            >
              + Add Task
            </Button>
          </div>

          <Modal show={this.state.showTask} onHide={this.handleShowTask}>
            <Modal.Header closeButton>
              <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleSubmitTask}>
                <Form.Group controlId="formCardTitle">
                  <Form.Control
                    as="textarea"
                    rows="3"
                    type="cardTitle"
                    placeholder={"Add Task"}
                    onChange={e => this.handleChangeTask(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleShowTask}>
                Close
              </Button>
              <Button variant="primary" onClick={e => this.handleSubmitTask(e)}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* {------------------------------------------------------------------------------------------------------------------------------} */}
          <Modal show={this.state.showEdit} onHide={this.handleShowEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Card Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={e => this.handleSubmitEdit(e)}>
                <Form.Group controlId="formCardTitle">
                  <Form.Control
                    // autofocus="true"
                    type="cardTitle"
                    defaultValue={this.state.title}
                    onChange={e => this.handleChangeEdit(e.target.value)}
                    // ref={textInput}
                  />
                </Form.Group>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleShowEdit}>
                Close
              </Button>
              <Button variant="danger">Delete?</Button>
              <Button variant="primary" onClick={this.handleSubmitEdit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    );
  }
}

var CardDropTarget = DropTarget(
  [ItemTypes.CARD, ItemTypes.TASK],
  cardTarget,
  dropCollect
)(Carddnd);
export default DragSource(ItemTypes.CARD, cardSource, dragCollect)(
  CardDropTarget
);
// export default DragSource(ItemTypes.CARD, cardSource, dragCollect)(Carddnd);
