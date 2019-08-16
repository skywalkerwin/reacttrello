import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import testBoard from "./testdata";
import Cards from "./Cards";
import Tasks from "./Tasks";

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
      <div>
        <Cards />
        <Cards />
        <Cards />
        hello world
      </div>
    </DndProvider>
  );
}
