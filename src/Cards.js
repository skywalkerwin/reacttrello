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
  const [{ isDragging, getitem, didDrop }, drag] = useDrag({
    item: { type: ItemTypes.CARD },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      getitem: monitor.getItem(),
      didDrop: monitor.didDrop()
    })
  });

  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, xy }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("DROPPED");
        return;
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      xy: monitor.getSourceClientOffset()
    })
  });

  let backgroundColor = "rgba(255,255,255,.5)";
  if (isOverCurrent || isOver) {
    backgroundColor = "lightblue";
  }
  const opacity = isDragging ? 0 : 1;
  // console.log("card drop xy");
  // console.log(xy);
  console.log(didDrop);
  return drag(
    drop(
      <div style={{ ...cardStyle, opacity, backgroundColor }}>
        <h2
          style={{ display: "flex", justifyContent: "center", margin: "4px" }}
        >
          {props.card.title}
        </h2>
        {renderTasks(props.card.id)}
      </div>
    )
  );
}
