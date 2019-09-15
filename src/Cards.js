import React, { useState, Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag, useDrop } from "react-dnd";
import Tasks from "./Tasks";
import testBoard from "./testdata";

//<style>card {display: flex;}</style>;
const cardStyle = {
  alignSelf: "flex-start",
  position: "relative",
  backgroundColor: "white",
  cursor: "move",
  display: "flex",
  width: "30%",
  height: "auto",
  flexDirection: "column",
  padding: "5px",
  border: "4px solid blue",
  margin: "8px",
  borderRadius: "12px"
};

const buttonStyle = {
  height: "15px",
  width: "10%",
  border: "2px",
  padding: "1px",
  margin: "2px"
};

const editCard = {
  position: "absolute",
  // left: "1px",
  // height: "20px",
  // bottom: "20%",
  // left: "88%"
  margin: "6px"
};

function renderTasks(cid) {
  var taskList = [];
  var ctasks = [];
  ctasks = testBoard.tasks.filter(t => t.cid === cid);
  ctasks.forEach(t => {
    taskList.push(<Tasks task={t} />);
  });
  taskList.push(
    <input
      type="button"
      value="+ Add Task"
      style={{
        margin: "5px",
        textAlign: "left",
        width: "85px",
        height: "25px"
      }}
    ></input>
  );
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

  let backgroundColor = "rgba(200,200,255,1)";
  if (isOverCurrent || isOver) {
    // backgroundColor = "lightblue";
    backgroundColor = "lightgreen";
  }
  const opacity = isDragging ? 0 : 1;
  return drag(
    drop(
      <div style={{ ...cardStyle, opacity, backgroundColor }}>
        <h2
          style={{
            // position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            margin: "3px"
            // bottom: "5%"
          }}
        >
          {props.card.title}
        </h2>
        <a style={editCard}>
          <button
            // style={buttonStyle}
            type="button"
            className="btn btn-default btn-sm"
          >
            Edit
          </button>
        </a>
        {renderTasks(props.card.id)}
      </div>
    )
  );
}
