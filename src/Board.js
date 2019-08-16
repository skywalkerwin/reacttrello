import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import testBoard from "./testdata";
import Cards from "./Cards";
import Tasks from "./Tasks";

const boardStyle = {
  display: "flex",
  flexDirection: "row",
  padding: "10px",
  border: "1px solid grey"
};

export default function Board() {
  var res = testBoard.tasks.filter(task => task.id > 0).map(a => a.content);
  console.log(res);

  function renderCards() {
    return <Cards />;
  }

  function renderTasks() {
    return <Tasks />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={boardStyle}>
        <Cards />
        <Cards />
        <Cards />
      </div>
    </DndProvider>
  );
}
