import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import Tasks from "./Tasks";

//<style>card {display: flex;}</style>;
const cardStyle = {
  display: "flex",
  width: "30%",
  flexDirection: "column",
  padding: "5px",
  border: "2px solid blue",
  margin: "10px"
};

export default function Cards() {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  console.log(this.props);
  return (
    <div ref={drag} style={cardStyle}>
      <h2 style={{ display: "flex", justifyContent: "center", margin: "4px" }}>
        {this.props.card}
      </h2>
      <Tasks>Task1</Tasks>
      <Tasks>Task2</Tasks>
      <Tasks>Task3</Tasks>
    </div>
  );
}
