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
  const [{ isDragging, xy }, drag] = useDrag({
    item: { type: ItemTypes.TASK },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      xy: monitor.getClientOffset()
    })
  });
  const opacity = isDragging ? 0 : 1;
  return drag(
    <div style={{ ...taskStyle, opacity }}>{props.task.content}</div>
  );
}
