import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import testBoard from "./testdata";

export default function Board() {
  var res = testBoard.tasks.filter(task => task.id > 0).map(a => a.content);
  console.log(res);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>{res.forEach(x => x)}</div>
    </DndProvider>
  );
}
