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
  // updateCard(cid) {
  //   console.log("ATTEMPTING UPDATE CALL");
  //   console.log(cid);
  //   var formdata = new FormData();
  //   formdata.set("cardID", cid);
  //   axios({
  //     method: "post",
  //     url: "http://127.0.0.1:5000/getTasks",
  //     data: formdata
  //   })
  //     .then(res => {
  //       console.log("UPDATED TASKS");
  //       const oldCards = this.state.cards.filter(c => c.cardID != cid);
  //       const card = this.state.cards.filter(c => c.cardID == cid);
  //       console.log("oldcard");
  //       console.log(card[0]);
  //       const newCard = {
  //         boardID: card[0].boardID,
  //         cardID: card[0].cardID,
  //         cardOrder: card[0].cardOrder,
  //         created: card[0].created,
  //         numTasks: card[0].numTasks,
  //         title: card[0].title,
  //         tasks: res.data
  //       };
  //       console.log("OLD");
  //       console.log(this.state.cards);
  //       this.setState({
  //         cards: [...oldCards, newCard]
  //       });
  //       console.log("NEW");
  //       console.log(this.state.cards);
  //       this.forceUpdate();
  //     })
  //     .catch(err => console.log(err));
  //   this.forceUpdate();
  // }
  updateCard(cid) {
    console.log("updatedBoard");
    axios.get("http://127.0.0.1:5000/boardData").then(res => {
      // console.log(res);
      console.log(res.data);
      console.log(res.data.cards === this.state.cards);
      console.log(res.data.cards[0].tasks);
      console.log(this.state.cards[0].tasks);
      console.log(res.data.cards[0].tasks == this.state.cards[0].tasks);
      this.setState({
        cards: res.data["cards"],
        boardID: res.data["boardID"],
        numCards: res.data["numCards"],
        numTasks: res.data["numTasks"],
        updated: cid
      });
    });
    // this.forceUpdate();
  }
  resetCheck() {
    console.log("TRYING TO RESET");
    console.log(this.state.updated);
    this.state.updated = 0;
    this.setState({
      updated: 0
    });
    this.state.updated = 0;
    console.log(this.state.updated);
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
        {this.state.boardID != -1 && (
          <Board
            cards={this.state.cards}
            boardID={this.state.boardID}
            numCards={this.state.numCards}
            numTasks={this.state.numTasks}
            updateCard={this.updateCard}
            updatedCardID={this.state.updated}
            resetCheck={this.resetCheck}
          />
        )}
      </DndProvider>
    );
  }
}
