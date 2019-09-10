import React, { useState, Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag, useDrop } from "react-dnd";
import Tasks from "./Tasks";
import testBoard from "./testdata";

//<style>card {display: flex;}</style>;
const cardStyle = {
  position: "relative",
  backgroundColor: "white",
  cursor: "move",
  display: "flex",
  width: "30%",
  flexDirection: "column",
  padding: "5px",
  border: "2px solid blue",
  margin: "10px"
};

const editCard = {
  display: "flex",
  position: "relative",
  height: "20px",
  // bottom: "20%",
  left: "88%"
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
  const cid = props.card.id;
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
  const [{ isOver, isOverCurrent, xy, res }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      console.log(didDrop);
      if (didDrop) {
        console.log("DID DROP");
        return;
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
      console.log("Card's Tasks");
      console.log(testBoard.tasks.filter(t => t.cid == cid));
      // return testBoard.tasks.filter(t => t.cid == cid);
      return { cid: cid };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      xy: monitor.getSourceClientOffset(),
      res: monitor.getDropResult()
    })
  });

  let backgroundColor = "rgba(255,255,255,.5)";
  if (isOverCurrent || isOver) {
    backgroundColor = "lightblue";
  }
  const opacity = isDragging ? 0 : 1;
  return drag(
    drop(
      <div style={{ ...cardStyle, opacity, backgroundColor }}>
        <a style={editCard}>
          <button
            // style={buttonStyle}
            type="button"
            class="btn btn-default btn-sm"
          >
            Edit
          </button>
        </a>
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
