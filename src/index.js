import React from "react";
import ReactDOM from "react-dom";
import Board from "./Board";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <Board />
    {console.log("")}
  </DndProvider>,
  document.getElementById("root")
);
