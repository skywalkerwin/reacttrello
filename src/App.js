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
      cards: [],
      boardID: -1,
      numCards: 0
    };
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:5000/boardData").then(res => {
      // console.log(res);
      // console.log(res.data);
      //   console.log(res.data.cards);
      this.setState({
        cards: res.data["cards"],
        boardID: res.data["boardID"],
        numCards: res.data["numCards"]
      });
    });
  }
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        {this.state.boardID != -1 && (
          <Board
            cards={this.state.cards}
            boardID={this.state.boardID}
            numCards={this.state.numCards}
          />
        )}
      </DndProvider>
    );
  }
}
