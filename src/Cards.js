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
  padding: "4px",
  border: "4px solid blue",
  margin: "6px",
  marginTop: "12px",
  borderRadius: "15px",
  width: "320px",
  overflow: "hidden",
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
  const card = props.card;
  const cardID = props.card.cardID;
  const [allTasks, setAllTasks] = useState(props.card.tasks);
  const [show, setShow] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tempTitle, setTempTitle] = useState(props.card.title);
  const [cardTitle, setCardTitle] = useState(props.card.title);
  const [tempTask, setTempTask] = useState("");
  const [numTasks, setNumTasks] = useState(card.numTasks);
  const [deleted, setDeleted] = useState(false);

  // const getTasks = () => {
  //   const cid = cardID;
  //   console.log("ATTEMPTING UPDATE CALL");
  //   var formdata = new FormData();
  //   formdata.set("cardID", cardID);
  //   axios({
  //     method: "post",
  //     url: "http://127.0.0.1:5000/getTasks",
  //     data: formdata
  //   })
  //     .then(res => {
  //       console.log("UPDATED TASKS");
  //       console.log(res.data);
  //       setAllTasks(res.data);
  //     })
  //     .catch(err => console.log(err));
  // };
  // const [childCall, setChildCall] = useState(getTasks);

  const [{ isDragging, getitem, didDrop }, drag] = useDrag({
    item: { type: ItemTypes.CARD },
    begin(monitor) {},
    end(item, monitor) {
      console.log("DROPPED");
      const dropRes = monitor.getDropResult();
      if (dropRes != null) {
        console.log(dropRes);
        const dropTarget = dropRes.droppedOn;
        if (dropTarget == "trash") {
          console.log("Card dropped on trash");
          var formdata = new FormData();
          formdata.set("cardID", cardID);
          axios({
            method: "post",
            url: "http://127.0.0.1:5000/deleteCard",
            data: formdata
          })
            .then(res => {
              console.log(res);
              setDeleted(true);
            })
            .catch(err => console.log(err));
          return null;
        } else if (dropTarget == "board") {
          console.log("board");
          // return;
        } else if (dropTarget == "card") {
          console.log("card");
          // return;
        }
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      getitem: monitor.getItem(),
      didDrop: monitor.didDrop()
    })
  });
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, obj, xy, res }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // console.log(didDrop);
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
      return {
        droppedOn: "card",
        taskID: Number(-1),
        cardID: Number(card.cardID)
      };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      xy: monitor.getSourceClientOffset(),
      res: monitor.getDropResult(),
      obj: monitor.getItemType()
    })
  });

  const [hasDroppedTop, setHasDroppedTop] = useState(false);
  const [hasDroppedOnChildTop, setHasDroppedOnChildTop] = useState(false);
  const [{ isOverTop, isOverCurrentTop, objTop, resTop }, dropTop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // console.log(didDrop);
      setHasDroppedTop(true);
      setHasDroppedOnChildTop(didDrop);
      return {
        droppedOn: "cardTop",
        taskID: Number(0),
        cardID: Number(card.cardID)
      };
    },
    collect: monitor => ({
      isOverTop: monitor.isOver(),
      isOverCurrentTop: monitor.isOver({ shallow: true }),
      resTop: monitor.getDropResult(),
      objTop: monitor.getItemType()
    })
  });

  let backgroundColor = "rgba(200,200,255,1)";
  if (isOverCurrent || isOverCurrentTop) {
    if (obj == ItemTypes.TASK) {
      backgroundColor = "lightgreen";
    } else if (obj == ItemTypes.CARD) {
      backgroundColor = "violet";
    }
  }
  const opacity = isDragging ? 0.2 : 1;

  function renderTasks(tasks) {
    var taskList = [];
    if (props.card !== undefined && tasks !== undefined) {
      Array.from(tasks).forEach(t => {
        taskList.push(<Tasks task={t} updateCard={props.updateCard} />);
      });
    }
    return taskList;
  }

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
    const boardID = card.boardID;
    const cardID = card.cardID;
    // const taskID = props.nextTaskID;
    const created = new Date().toUTCString();
    // setNumTasks(numTasks + 1);
    // console.log("num_tasks");
    // console.log(numTasks);
    setShowTaskModal(false);
    var formdata = new FormData();
    formdata.set("boardID", boardID);
    formdata.set("body", tempTask);
    formdata.set("cardID", cardID);
    // formdata.set("taskOrder", numTasks);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/addTask",
      data: formdata
    })
      .then(res => {
        // console.log("IN TASK RESULT");
        console.log(res);
        const extraTask = {
          boardID: res.data.boardID,
          body: tempTask,
          cardID: res.data.cardID,
          created: res.data.created,
          taskID: res.data.taskID,
          taskOrder: res.data.numTasks
        };
        console.log(extraTask);
        while (extraTask == undefined) {
          console.log("wait");
        }
        console.log(extraTask.taskOrder);
        if (allTasks !== undefined) {
          setAllTasks([...Array.from(allTasks), extraTask]);
        } else {
          setAllTasks(extraTask);
        }
      })
      .catch(err => console.log(err));
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleShowTask = () => {
    setShowTaskModal(true);
  };
  if (deleted == true) {
    return null;
  } else {
    return drag(
      drop(
        <div style={{ ...cardStyle, opacity, backgroundColor }}>
          <h2
            ref={dropTop}
            style={{
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              display: "flex",
              justifyContent: "center",
              margin: "4px"
            }}
          >
            {cardTitle}
            numTasks{card.numTasks}
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
              borderRadius: "5px",
              marginTop: "5px",
              marginBottom: "5px",
              marginLeft: "8px",
              textAlign: "left",
              minWidth: "100px",
              height: "35px",
              width: "110px"
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
}
