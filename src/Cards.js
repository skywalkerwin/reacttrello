import React, { useState, Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag, useDrop } from "react-dnd";
import Tasks from "./Tasks";
import testBoard from "./testdata";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { format } from "url";

const cardStyle = {
  alignSelf: "flex-start",
  position: "relative",
  backgroundColor: "white",
  cursor: "move",
  display: "flex",
  width: "30%",
  height: "auto",
  flexDirection: "column",
  padding: "5px",
  border: "4px solid blue",
  margin: "8px",
  borderRadius: "12px"
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

function renderTasks(tasks) {
  var taskList = [];
  var ctasks = [];
  tasks.forEach(t => {
    taskList.push(<Tasks task={t} />);
  });
  taskList.push(
    <input
      type="button"
      value="+ Add Task"
      style={{
        margin: "5px",
        textAlign: "left",
        width: "100px",
        height: "30px"
      }}
    ></input>
  );
  return taskList;
}

export default function Cards(props) {
  let textInput = React.createRef();
  const cid = props.card.id;
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
      return { cid: cid };
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

  const [show, setShow] = useState(false);
  const [tempTitle, setTempTitle] = useState(props.card.title);
  const [cardTitle, setCardTitle] = useState(props.card.title);
  const handleClose = () => setShow(false);
  function handleChange(e) {
    setTempTitle(e);
  }
  const handleSubmit = () => {
    setCardTitle(tempTitle);
    // console.log("TEMP TITLE:", tempTitle);
    // console.log("CARD TITLE:", cardTitle);
    setShow(false);
    var formdata = new FormData();
    formdata.set("title", tempTitle);

    // axios.post("http://127.0.0.1:5000/updateCard", {
    //   title: cardTitle
    // });
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/updateCard",
      data: formdata
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Content-Type": "multipart/form-data",
      //   "Accept-Encoding": "gzip, deflate"
      // }
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  const handleShow = () => setShow(true);
  function titleEdit() {
    console.log("CLICK");
    handleShow();
  }
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
        {renderTasks(props.card.tasks)}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Card Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCardTitle">
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                  type="cardTitle"
                  // value={props.card.title}
                  placeholder={props.card.title}
                  onChange={e => handleChange(e.target.value)}
                  ref={textInput}
                />
                {/* <input
                  // value={props.card.title}
                  placeholder={props.card.title}
                  onChange={handleChange}
                ></input> */}
                {/* {console.log(cardTitle)} */}
                {/* <textarea>hello</textarea> */}
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
      </div>
    )
  );
}
