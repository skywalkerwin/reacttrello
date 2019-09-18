import React, { useState, Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag, useDrop } from "react-dnd";
import Tasks from "./Tasks";
import testBoard from "./testdata";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";

const cardStyle = {
  alignSelf: "flex-start",
  position: "relative",
  backgroundColor: "white",
  cursor: "move",
  // float: "left",
  // display: "table-column",
  display: "flex",
  maxHeight: "82vh",
  // minHeight: "15vh",
  // minWidth: "20%",
  // height: "auto",
  flexDirection: "column",
  padding: "5px",
  border: "4px solid blue",
  margin: "8px",
  borderRadius: "12px",
  width: "340px",
  overflowY: "auto"
};

const buttonStyle = {
  height: "15px",
  width: "10%",
  border: "2px solid red",
  padding: "1px",
  margin: "2px"
};

const editCard = {
  position: "absolute",
  // left: "1px",
  // height: "20px",
  // bottom: "20%",
  // left: "88%"
  margin: "6px"
};

export default function Cards(props) {
  // let textInput = React.createRef();
  // console.log(props.card);
  const cardID = props.card.cardID;
  const [{ isDragging, getitem, didDrop }, drag] = useDrag({
    item: { type: ItemTypes.CARD },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      getitem: monitor.getItem(),
      didDrop: monitor.didDrop()
    })
  });
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, xy, res }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
      // console.log("Card's Tasks");
      // console.log(testBoard.tasks.filter(t => t.cid == cid));
      return { cardID: cardID };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      xy: monitor.getSourceClientOffset(),
      res: monitor.getDropResult()
    })
  });
  let backgroundColor = "rgba(200,200,255,1)";
  if (isOverCurrent || isOver) {
    backgroundColor = "lightgreen";
  }
  const opacity = isDragging ? 0 : 1;

  function renderTasks(tasks) {
    var taskList = [];
    console.log("IN RENDER TASKS");
    console.log(tasks);
    if (props.card !== undefined && tasks !== undefined) {
      tasks.forEach(t => {
        taskList.push(<Tasks task={t} />);
      });
    }
    return taskList;
  }
  const [allTasks, setAllTasks] = useState(props.card.tasks);
  const [show, setShow] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tempTitle, setTempTitle] = useState(props.card.title);
  const [cardTitle, setCardTitle] = useState(props.card.title);
  const [tempTask, setTempTask] = useState("");

  const handleClose = () => setShow(false);
  const handleCloseTask = () => setShowTaskModal(false);
  function handleChange(e) {
    setTempTitle(e);
  }
  function handleChangeTask(e) {
    setTempTask(e);
  }
  const handleSubmit = () => {
    setCardTitle(tempTitle);
    setShow(false);
    var formdata = new FormData();
    formdata.set("title", tempTitle);
    formdata.set("cardID", cardID);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/updateCard",
      data: formdata
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  const handleSubmitTask = () => {
    // setCardTitle(tempTitle);
    const boardID = props.card.boardID;
    const cardID = props.card.cardID;
    const numTasks = props.card.numTasks + 1;
    const extraTask = {
      boardID: boardID,
      body: tempTask,
      cardID: cardID,
      created: Date.UTC(),
      taskOrder: numTasks
    };
    if (allTasks !== undefined) {
      setAllTasks([...allTasks, extraTask]);
    } else {
      setAllTasks(extraTask);
    }
    setShowTaskModal(false);
    var formdata = new FormData();
    formdata.set("boardID", boardID);
    formdata.set("body", tempTask);
    formdata.set("cardID", cardID);
    formdata.set("taskOrder", numTasks);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/addTask",
      data: formdata
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    // return renderTasks([extraTask]);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleShowTask = () => {
    setShowTaskModal(true);
  };
  return drag(
    drop(
      <div style={{ ...cardStyle, opacity, backgroundColor }}>
        <h2
          style={{
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            margin: "3px"
          }}
        >
          {cardTitle}
        </h2>
        <a style={editCard}>
          <button
            onClick={handleShow}
            type="button"
            className="btn btn-default btn-sm"
          >
            Edit
          </button>
        </a>
        {renderTasks(allTasks)}
        <Button
          variant="secondary"
          onClick={handleShowTask}
          type="button"
          style={{
            // position: "absolute",
            margin: "5px",
            textAlign: "left",
            minWidth: "100px",
            height: "35px",
            width: "120px"
            // bottom: "0"
          }}
        >
          + Add Task
        </Button>

        <Modal show={showTaskModal} onHide={handleCloseTask}>
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
        </Modal>
        {/* {------------------------------------------------------------------------------------------------------------------------------} */}
        <Modal show={show} onHide={handleClose}>
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
        </Modal>
      </div>
    )
  );
}
