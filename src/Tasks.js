import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";

const taskStyle = {
  display: "flex",
  align: "left",
  width: "100%",
  padding: "20%",
  border: "2px solid green",
  margin: "5px"
};

export default class Tasks extends Component {
  render() {
    return <div style={taskStyle}> Task </div>;
  }
}
