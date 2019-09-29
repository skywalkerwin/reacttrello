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
import BoardDropTarget from "./dnd/Boarddnd";
// import Boarddnd from "./dnd/Boarddnd";

import { Provider } from "react-redux";
// import store from "./store";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateCard = this.updateCard.bind(this);
    this.resetCheck = this.resetCheck.bind(this);
    this.state = {
      cards: [],
      boardID: -1,
      numCards: 0,
      numTasks: 0,
      updated: 0
    };
  }

  updateCard(cid) {
    console.log("APP UPDATING CARDS TASKS");
    var formdata = new FormData();
    formdata.set("cardID", cid);
    return axios({
      method: "post",
      url: "http://127.0.0.1:5000/getTasks",
      data: formdata
    }).then(res => {
      console.log(res);
      console.log(res.data);
      return res.data;
    });
  }

  resetCheck() {
    // console.log("TRYING TO RESET");
    // console.log(this.state.updated);
    this.state.updated = 0;
    this.setState({
      updated: 0
    });
    this.state.updated = 0;
    // console.log(this.state.updated);
    this.forceUpdate();
  }
  componentDidMount() {
    axios.get("http://127.0.0.1:5000/boardData").then(res => {
      // console.log(res);
      // console.log(res.data);
      //   console.log(res.data.cards);
      this.setState({
        cards: res.data["cards"],
        boardID: res.data["boardID"],
        numCards: res.data["numCards"],
        numTasks: res.data["numTasks"]
      });
    });
  }
  // componentDidUpdate() {
  //   console.log("updated");
  //   // this.forceUpdate();
  //   // if (prevProps !== this.props)
  //   axios.get("http://127.0.0.1:5000/boardData").then(res => {
  //     this.setState({
  //       cards: res.data["cards"],
  //       boardID: res.data["boardID"],
  //       numCards: res.data["numCards"],
  //       numTasks: res.data["numTasks"]
  //     });
  //   });
  // }
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        {/* {this.state.boardID != -1 && (
          <Board
            cards={this.state.cards}
            boardID={this.state.boardID}
            numCards={this.state.numCards}
            numTasks={this.state.numTasks}
            updateCard={this.updateCard}
            updatedCardID={this.state.updated}
            resetCheck={this.resetCheck}
          />
        )} */}
        {/* <Boarddnd cards={this.state.cards}></Boarddnd> */}
        <BoardDropTarget
          boardID={this.state.boardID}
          cards={this.state.cards}
          numCards={this.state.numCards}
        ></BoardDropTarget>
      </DndProvider>
    );
  }
}
