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

export default function Tasks() {
  return <div style={taskStyle}> Task </div>;
}
