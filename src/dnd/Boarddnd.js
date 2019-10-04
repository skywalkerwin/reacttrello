import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import React, { Component } from "react";
import "../css/Board.css";
import Carddnd from "./Carddnd";
import CardDropTarget from "./Carddnd";
import TrashDropTarget from "./Trashdnd";

const boardTarget = {
  hover(props, monitor, component) {
    const coff = monitor.getClientOffset();
    const item = monitor.getItem();
    // console.log("HOVERING BOARD ITEM:", item);
    // console.log(item, coff);
    // console.log(props);
  },
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // console.log("DID DROP ON BOARD");
      const item = monitor.getItem();
      const dropRes = monitor.getDropResult();
      // console.log(item, dropRes);
      if (dropRes.droppedOn === "Trash") {
        if (item.id === "Card") {
          var formdata = new FormData();
          formdata.set("cardID", item.card.cardID);
          axios({
            method: "post",
            url: "http://127.0.0.1:5000/deleteCard",
            data: formdata
          })
            .then(res => {
              console.log(res);
            })
            .catch(err => console.log(err));
          const restCards = component.state.cards.filter(
            c => c.cardID !== item.card.cardID
          );
          component.setState({
            cards: restCards,
            numCards: component.state.numCards - 1
          });
        }

        if (item.id === "Task") {
          // deleteTask(item.task);
        }
      }
      return;
    }
    const item = monitor.getItem();
    // console.log("board item", item);
    return { droppedOn: "Board", moved: true };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class Boarddnd extends Component {
  constructor(props) {
    super(props);
    this.drawCards = this.drawCards.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleShowAdd = this.handleShowAdd.bind(this);
    this.handleSubmitCard = this.handleSubmitCard.bind(this);
    const allCards = JSON.parse(JSON.stringify(this.props.cards));
    this.state = {
      boardID: this.props.boardID,
      cards: allCards,
      showAdd: false,
      tempTitle: "",
      numTasks: this.props.numCards
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.cards !== prevProps.cards) {
      const allCards = JSON.parse(JSON.stringify(this.props.cards));
      this.setState({
        boardID: this.props.boardID,
        cards: allCards,
        numCards: this.props.numCards
      });
    }
  }
  handleChangeTitle(e) {
    this.setState({
      tempTitle: e
    });
  }
  handleShowAdd() {
    this.setState({
      showAdd: !this.state.showAdd
    });
  }
  handleSubmitCard = e => {
    e.preventDefault();
    this.setState({
      showAdd: !this.state.showAdd
    });
    var formdata = new FormData();
    formdata.set("boardID", this.state.boardID);
    formdata.set("title", this.state.tempTitle);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/addCard",
      data: formdata
    })
      .then(res => {
        const extraCard = {
          boardID: res.data.boardID,
          cardID: res.data.cardID,
          cardOrder: res.data.cardOrder,
          created: res.data.created,
          numTasks: 0,
          tasks: [],
          title: res.data.title
        };
        this.setState({
          cards: [...this.state.cards, extraCard],
          numCards: this.state.numCards + 1
        });
      })
      .catch(err => console.log(err));
  };
  drawCards() {
    var cardList = [];
    if (this.state.cards !== undefined) {
      this.state.cards.forEach(c =>
        cardList.push(<CardDropTarget key={c.cardID} card={c} />)
      );
    }
    return cardList;
  }
  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        {/* <h1 className="header">
          KanBan | Drag-n-Drop | Flask backend API / React frontend UI
        </h1> */}
        <div className="board">
          <h1 className="header">
            KanBan | Drag-n-Drop | Flask backend API / React frontend UI
          </h1>
          {this.drawCards()}
          <Button
            onClick={this.handleShowAdd}
            className="addCard"
            variant="secondary"
          >
            + Add List
          </Button>
          <Modal show={this.state.showAdd} onHide={this.handleShowAdd}>
            <Modal.Header closeButton>
              <Modal.Title>Add Card</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleSubmitCard}>
                <Form.Group controlId="formCardTitle">
                  <Form.Control
                    // autofocus="true"
                    type="cardTitle"
                    // defaultValue={cardTitle}
                    placeholder={"Title..."}
                    onChange={e => this.handleChangeTitle(e.target.value)}
                    // ref={textInput}
                  />
                </Form.Group>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleShowAdd}>
                Close
              </Button>
              <Button variant="primary" onClick={e => this.handleSubmitCard(e)}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          {<TrashDropTarget></TrashDropTarget>}
          {/* <div className="trash">
            <h2 className="trashText">
              🗑️ TRASH CAN - Drag here to Delete - ... Persistent Data
              (postgreSQL) - authorization/multi-users/multi-boards coming soon?
            </h2>
          </div> */}
        </div>
      </div>
    );
  }
}

export default DropTarget(
  [ItemTypes.CARD, ItemTypes.TASK],
  boardTarget,
  collect
)(Boarddnd);
