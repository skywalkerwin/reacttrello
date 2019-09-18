import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Cards from "./Cards";
import Tasks from "./Tasks";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";

function getStyle(backgroundColor) {
  return {
    position: "absolute",
    display: "flex",
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    height: "94.5%",
    // width: "auto",
    // maxWidth: "auto",
    padding: "5px",
    border: "5px solid orange",
    // overflowX: "auto",
    backgroundColor
  };
}
// const boardStyle = {
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: "center",
//   height: "25rem",
//   padding: "5px",
//   border: "1px solid orange"
// };

export default function Board(props) {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, obj }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        // console.log("did drop");
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
      <Button
        variant="secondary"
        style={{
          margin: "10px",
          padding: "5px",
          minWidth: "100px",
          height: "40px",
          width: "120px",
          textAlign: "left"
        }}
      >
        + Add List
      </Button>
    );
    // console.log(aList);
    return aList;
  }

  let backgroundColor = "rgba(255,255,150,.5)";
  if (isOverCurrent || isOver) {
    if (obj == ItemTypes.CARD) backgroundColor = "lightgreen";
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 style={{ display: "flex", justifyContent: "center", height: "4vh" }}>
        KanBan Drag-n-Drop
      </h1>
      <div ref={drop} style={getStyle(backgroundColor)}>
        {renderCards()}
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "left",
            height: "7vh",
            margin: "0px",
            border: "4px dashed black",
            bottom: "0%",
            width: "100%",
            backgroundColor: "rgba(255,0,0,.5)"
          }}
        >
          <h3
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              top: "20%",
              overflowX: "hidden"
            }}
          >
            🗑️ TRASH CAN - Drag here to Delete
          </h3>
        </div>
      </div>
    </DndProvider>
  );
}
