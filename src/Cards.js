import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import Tasks from "./Tasks";

//<style>card {display: flex;}</style>;
const cardStyle = {
  display: "flex",
  width: "30%",
  flexDirection: "column",
  padding: "10%",
  border: "2px solid blue",
  margin: "10px"
};

export default class Cards extends Component {
  render() {
    return (
      <div style={cardStyle}>
        <Tasks>Task1</Tasks>
        <Tasks>Task2</Tasks>
        <Tasks>Task3</Tasks>
      </div>
    );
  }
}
