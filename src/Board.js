import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Cards from "./Cards";
import Tasks from "./Tasks";
function getStyle(backgroundColor) {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "25rem",
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

export default function Board() {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.CARD,
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
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  function renderCards() {
    var cardList = [];
    testBoard.cards.forEach(c => {
      cardList.push(<Cards card={c} />);
    });
    cardList.push(
      <button
        style={{
          margin: "10px",
          padding: "5px",
          width: "20%",
          height: "10%",
          textAlign: "left"
        }}
      >
        + Add List
      </button>
    );
    return cardList;
  }

  function renderTasks() {
    return <Tasks />;
  }
  // let backgroundColor = "rgba(255,255,255,.5)";
  let backgroundColor = "rgba(255,255,150,.5)";
  if (isOverCurrent || isOver) {
    backgroundColor = "lightgreen";
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        TRELLO CLONE
      </h1>
      <div ref={drop} style={getStyle(backgroundColor)}>
        {renderCards()}
      </div>
    </DndProvider>
  );
}
