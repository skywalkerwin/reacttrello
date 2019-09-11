import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";

const taskStyle = {
  display: "flex",
  padding: "2px",
  border: "3px solid green",
  margin: "5px"
};
const editTask = {
  display: "flex",
  position: "relative",
  height: "20px",
  bottom: "20%",
  left: "88%"
};

const buttonStyle = {
  height: "15px",
  width: "10%",
  border: "5px",
  padding: "1px",
  margin: "3px"
};

const taskContent = {
  position: "relative",
  textAlign: "left",
  right: "20px",
  margin: "1px",
  width: "85%"
};
export default function Tasks(props) {
  const [{ isDragging, xy }, drag] = useDrag({
    item: { type: ItemTypes.TASK },
    begin(monitor) {
      console.log("TASK:...");
      console.log(props.task.content);
    },
    end(item, monitor) {
      console.log("DROPPED");
      console.log(monitor.didDrop());
      console.log(monitor.getDropResult().cid);
      console.log(props.task.cid);
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      xy: monitor.getClientOffset()
    })
  });
  let backgroundColor = "rgba(255,255,255,.9)";
  const opacity = isDragging ? 0 : 1;
  return drag(
    <div style={{ ...taskStyle, opacity, backgroundColor }}>
      <p style={editTask}>
        <button
          // style={buttonStyle}
          type="button"
          class="btn btn-default btn-sm"
        >
          Edit
        </button>
      </p>
      <p style={taskContent}>{props.task.content}</p>
    </div>
  );
}
