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
    this.state = {
      cards: [],
      boardID: -1,
      numCards: 0,
      numTasks: 0
    };
  }
  updateCard(cid) {
    console.log("ATTEMPTING UPDATE CALL");
    var formdata = new FormData();
    formdata.set("cardID", cid);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/getTasks",
      data: formdata
    })
      .then(res => {
        console.log("UPDATED TASKS");
        const oldCards = this.state.cards.filter(c => c.cardID != cid);
        const card = this.state.cards.filter(c => c.cardID == cid);
        const newCard = {
          boardID: card.boardID,
          cardID: card.cardID,
          created: card.created,
          numTasks: card.numTasks,
          title: card.title,
          tasks: res.data
        };
        this.setState({
          cards: [...oldCards, newCard]
        });
        console.log(res.data);
      })
      .catch(err => console.log(err));
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
  componentDidUpdate(prevProps) {
    console.log("updated");
    if (prevProps !== this.props)
      axios.get("http://127.0.0.1:5000/boardData").then(res => {
        // console.log(res);
        // console.log(res.data);
        //   console.log(res.data.cards);
        this.setState({
          cards: res.data["cards"],
          boardID: res.data["boardID"],
          nextCardID: res.data["nextCardID"],
          nextTaskID: res.data["nextTaskID"],
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
            numTasks={this.state.numTasks}
            updateCard={this.updateCard}
          />
        )}
      </DndProvider>
    );
  }
}
