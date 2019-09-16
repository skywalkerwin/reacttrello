import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Board from "./Board";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(<App />, document.getElementById("root"));
