import React, { useState, Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag, useDrop } from "react-dnd";
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

  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      console.log(item);
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  let backgroundColor = "rgba(255,255,255,.5)";
  if (isOverCurrent || isOver) {
    backgroundColor = "lightblue";
  }
  isOver || isOverCurrent
    ? console.log("TASK OVER")
    : console.log("TASK NOT OVER");
  isDragging
    ? console.log("CARD IS DRAGGING")
    : console.log("CARD NOT DRAGGING");

  const opacity = isDragging ? 0 : 1;
  const rref = isDragging ? drag : drop;
  console.log("CARD DETAILS:...");
  console.log(drag);
  console.log(drop);
  return (
    <div
      // ref={isDragging ? drag : drop}
      // ref={{ ...drag, drop }}
      ref={drag}
      style={{ ...cardStyle, opacity, backgroundColor }}
    >
      <h2 style={{ display: "flex", justifyContent: "center", margin: "4px" }}>
        {props.card.title}
      </h2>
      {renderTasks(props.card.id)}
    </div>
  );
}
