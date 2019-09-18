import React, { useState } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";

const taskStyle = {
  // position: "absolute",
  display: "flex",
  padding: "2px",
  // width: "300px",
  border: "3px solid green",
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
  // let textInput = React.createRef();
  const tid = props.task.id;
  const [{ isDragging, xy }, drag] = useDrag({
    item: { type: ItemTypes.TASK },
    begin(monitor) {
      // console.log("TASK:...");
      // console.log(props.task.content);
    },
    end(item, monitor) {
      // console.log("DROPPED");
      // console.log(monitor.didDrop());
      if (monitor.getDropResult() != null) {
        // console.log(monitor.getDropResult().cid);
      }
      // console.log(props.task.cid);
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      xy: monitor.getClientOffset()
    })
  });
  let backgroundColor = "rgba(255,255,255,.9)";
  const opacity = isDragging ? 0 : 1;

  const [show, setShow] = useState(false);
  const [tempBody, setTempBody] = useState(props.task.body);
  const [taskBody, setTaskBody] = useState(props.task.body);
  const handleClose = () => setShow(false);
  function handleChange(e) {
    setTempBody(e);
  }
  const handleSubmit = () => {
    setTaskBody(tempBody);
    // console.log("TEMP TITLE:", tempTitle);
    // console.log("CARD TITLE:", cardTitle);
    setShow(false);
    var formdata = new FormData();
    formdata.set("body", tempBody);
    formdata.set("id", tid);

    // axios.post("http://127.0.0.1:5000/updateCard", {
    //   title: cardTitle
    // });
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/updateTask",
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
  const handleShow = () => {
    setShow(true);
    // textInput.value = "TEST";
  };
  function titleEdit() {
    console.log("CLICK");
    handleShow();
  }

  return drag(
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
                  // autoFocus={"true"}
                  type="cardTitle"
                  // placeholder={taskBody}
                  onChange={e => handleChange(e.target.value)}
                  // ref={textInput}
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
      <p style={taskContent}>{taskBody}</p>
    </div>
  );
}
