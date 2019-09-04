import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import Tasks from "./Tasks";
import testBoard from "./testdata";

//<style>card {display: flex;}</style>;
const cardStyle = {
  backgroundColor: "white",
  cursor: "move",
  display: "flex",
  width: "30%",
  flexDirection: "column",
  padding: "5px",
  border: "2px solid blue",
  margin: "10px"
};

function renderTasks(cid) {
  var taskList = [];
  var ctasks = [];
  ctasks = testBoard.tasks.filter(t => t.cid === cid);
  ctasks.forEach(t => {
    taskList.push(<Tasks task={t} />);
  });
  return taskList;
}

export default function Cards(props) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });
  isDragging ? console.log("ISDRAGGING") : console.log("NOT DRAGGING");
  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={drag} style={{ ...cardStyle, opacity }}>
      <h2 style={{ display: "flex", justifyContent: "center", margin: "4px" }}>
        {props.card.title}
      </h2>
      {renderTasks(props.card.id)}
    </div>
  );
}
