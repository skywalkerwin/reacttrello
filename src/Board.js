import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Cards from "./Cards";
import Tasks from "./Tasks";

const boardStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  height: "25rem",
  padding: "5px",
  border: "1px solid orange"
};

export default function Board() {
  var res = testBoard.tasks.filter(task => task.id > 0).map(a => a.content);
  console.log(res);

  const drop = useDrop({ accept: ItemTypes.CARD });

  function renderCards() {
    return <Cards />;
  }

  function renderTasks() {
    return <Tasks />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <h1 style={{ display: "flex", justifyContent: "center" }}>
        TRELLO CLONE
      </h1> */}
      <div ref={drop} style={boardStyle}>
        <Cards card={testBoard.cards[0].title} />
        <Cards card={testBoard.cards[1].title} />
        <Cards card={testBoard.cards[2].title} />
      </div>
    </DndProvider>
  );
}
