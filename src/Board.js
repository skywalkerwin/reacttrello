import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Cards from "./Cards";
import Tasks from "./Tasks";
import axios from "axios";

function getStyle(backgroundColor) {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "80vh",
    padding: "5px",
    border: "3px solid orange",
    backgroundColor
  };
}
const boardStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  height: "25rem",
  padding: "5px",
  border: "1px solid orange"
};

export default function Board(props) {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, obj }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("did drop");
        return;
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      obj: monitor.getItemType()
    })
  });

  function renderCards() {
    var aList = [];
    props.board.forEach(c => aList.push(<Cards card={c} />));
    // props.board.forEach(c => console.log(c));
    // console.log(boardData);
    aList.push(
      <button
        style={{
          margin: "10px",
          padding: "5px",
          width: "85px",
          height: "30px",
          textAlign: "left"
        }}
      >
        + Add List
      </button>
    );
    console.log(aList);
    return aList;
  }

  function renderTasks() {
    return <Tasks />;
  }
  let backgroundColor = "rgba(255,255,150,.5)";
  if (isOverCurrent || isOver) {
    if (obj == ItemTypes.CARD) backgroundColor = "lightgreen";
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 style={{ display: "flex", justifyContent: "center", height: "3vh" }}>
        Brain Board
      </h1>
      <div ref={drop} style={getStyle(backgroundColor)}>
        {renderCards()}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "9vh",
          margin: "5px",
          border: "2px solid red"
        }}
      >
        <h1>🗑️ TRASH CAN - implement functionality</h1>
      </div>
    </DndProvider>
  );
}
