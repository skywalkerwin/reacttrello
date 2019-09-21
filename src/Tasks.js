import React, { useState } from "react";
import { ItemTypes } from "./Constants";
import { useDrag, useDrop } from "react-dnd";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";

const taskStyle = {
  // position: "absolute",
  overflow: "hidden",
  display: "flex",
  padding: "3px",
  // width: "300px",
  border: "4px solid green",
  margin: "5px",
  borderRadius: "10px"
};
const editTask = {
  display: "flex",
  position: "relative",
  height: "25px",
  top: "1px",
  // bottom: "1px",
  left: "86%"
  // left: "10px"
};

const buttonStyle = {
  height: "15px",
  width: "4%",
  border: "2px",
  padding: "1px",
  margin: "1px",
  border: "1px solid black"
};

const taskContent = {
  position: "relative",
  textAlign: "left",
  right: "35px",
  margin: "1px",
  width: "88%"
};
export default function Tasks(props) {
  // console.log("props");
  // console.log(props);
  const task = props.task;
  const taskID = task.taskID;
  const [show, setShow] = useState(false);
  const [tempBody, setTempBody] = useState(props.task.body);
  const [taskBody, setTaskBody] = useState(props.task.body);
  const [deleted, setDeleted] = useState(false);
  //modal functions
  const handleClose = () => setShow(false);
  function handleChange(e) {
    setTempBody(e);
  }
  const handleSubmit = () => {
    setTaskBody(tempBody);
    setShow(false);
    var formdata = new FormData();
    formdata.set("body", tempBody);
    formdata.set("taskID", taskID);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/updateTask",
      data: formdata
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  const handleShow = () => {
    setShow(true);
  };
  //api function calls
  function deleteTask(tid) {
    var formdata = new FormData();
    formdata.set("taskID", tid);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/deleteTask",
      data: formdata
    })
      .then(res => {
        console.log(res);
        setDeleted(true);
      })
      .catch(err => console.log(err));
  }
  function moveTask(draggedID, droppedID, cardID) {
    var formdata = new FormData();
    formdata.set("taskID", draggedID);
    formdata.set("droppedID", Number(droppedID));
    formdata.set("cardID", Number(cardID));
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/moveTask",
      data: formdata
    })
      .then(res => {
        console.log(res);
        // setDeleted(true);
        // props.updateCard(cid);
      })
      .catch(err => console.log(err));
  }
  //drag and drop function hooks
  const [{ isDragging }, drag] = useDrag({
    // item: { type: ItemTypes.TASK },
    item: {
      type: "task",
      boardID: task.boardID,
      body: task.body,
      cardID: task.cardID,
      created: task.created,
      taskID: task.taskID,
      taskOrder: task.taskOrder
    },
    begin(monitor) {},
    end(item, monitor) {
      // console.log("TASK DRAGGED => DROPPED");
      const dropRes = monitor.getDropResult();
      if (dropRes != null) {
        console.log(dropRes);
        const dropTarget = dropRes.droppedOn;
        if (dropTarget == "trash") {
          // console.log("Task dragged on trash");
          deleteTask(taskID);
          return null;
        } else if (dropTarget == "board") {
          // console.log("board");
          return;
        } else if (dropTarget == "cardTop") {
          // console.log("dragged on cardTop");
          if (task.cardID == dropRes.cardID) {
            if (task.taskID != dropRes.taskID) {
              moveTask(task.taskID, dropRes.taskID, dropRes.cardID);
              // setTaskBody(task.body);
            }
          }
        } else if (dropTarget == "card") {
          console.log("dragged on card");
          console.log("body = ", task.body);
          console.log(dropRes.taskID);
          if (task.cardID == dropRes.cardID) {
            if (task.taskID != dropRes.taskID) {
              moveTask(task.taskID, dropRes.taskID, dropRes.cardID);
              // setTaskBody(task.body);
            }
          }
        } else if (dropTarget == "task") {
          // console.log("dragged on task");
          if (task.cardID == dropRes.cardID) {
            if (task.taskID != dropRes.taskID) {
              moveTask(task.taskID, dropRes.taskID, dropRes.cardID);
              // setTaskBody(task.body);
            }
          }
          if (task.cardID != dropRes.cardID) {
            console.log("Moved to different Card");
          }
          return;
        }
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const [hasDropped, setHasDropped] = useState(false);
  const [{ isOver, isOverCurrent, obj, res }, drop] = useDrop({
    accept: [ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("did drop task");
        return;
      }
      // console.log("DROPPED ON TASK");
      // console.log(monitor.getItem());
      setHasDropped(true);
      return {
        droppedOn: "task",
        boardID: task.boardID,
        body: task.body,
        cardID: task.cardID,
        created: task.created,
        taskID: task.taskID,
        taskOrder: task.taskOrder
      };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      res: monitor.getDropResult(),
      obj: monitor.getItemType()
    })
  });

  let backgroundColor = "rgba(255,255,255,.9)";
  if (isOverCurrent || isOver) {
    if (obj == ItemTypes.TASK) {
      backgroundColor = "yellow";
    }
  }
  const opacity = isDragging ? 0.2 : 1;

  if (deleted == true) {
    return null;
  } else {
    return drag(
      drop(
        <div>
          <div style={{ ...taskStyle, opacity, backgroundColor }}>
            <p style={editTask}>
              <button
                // style={buttonStyle}
                type="button"
                className="btn btn-default btn-sm"
                onClick={handleShow}
              >
                Edit
              </button>
              <Modal show={show} onHide={handleClose}>
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
              </Modal>
            </p>
            <p style={taskContent}>
              {taskBody}
              ORDER
              {task.taskOrder}
            </p>
          </div>
        </div>
      )
    );
  }
}
