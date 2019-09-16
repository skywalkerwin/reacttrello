// import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Board from "./Board";
import Cards from "./Cards";
import Tasks from "./Tasks";
import axios from "axios";
import React, { Component } from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: []
    };
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:5000/boardData").then(res => {
      //   console.log(res);
      //   console.log(res.data);
      //   console.log(res.data.cards);
      this.setState({
        boardData: res.data["cards"]
      });
    });
  }
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        {/* {console.log(this.state.boardData)} */}
        <Board board={this.state.boardData} />
      </DndProvider>
    );
  }
}
