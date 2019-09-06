import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";

const taskStyle = {
  display: "flex",
  align: "left",
  marginLeft: "5px",
  padding: "2px",
  border: "2px solid green",
  margin: "5px"
};

export default function Tasks(props) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.TASK },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });
  // isDragging
  //   ? console.log("TASK IS DRAGGING")
  //   : console.log("TASK NOT DRAGGING");
  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={drag} style={{ ...taskStyle, opacity }}>
      {props.task.content}
    </div>
  );
}
