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

const boardTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      console.log("DID DROP ON BOARD");
      return;
    }
    const item = monitor.getItem();
    console.log("board item", item);
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
    this.state = {};
  }
  drawCards(allCards) {
    var cardList = [];
    if (allCards !== undefined) {
      allCards.forEach(c => cardList.push(<CardDropTarget card={c} />));
      // allCards.forEach(c => cardList.push(<dropTarget card={c} />));
    }
    return cardList;
  }
  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        {/* {console.log(this.props.cards)} */}
        <h1 className="header">
          KanBan | Drag-n-Drop | Flask backend API / React frontend UI
        </h1>
        <div className="board">
          {this.drawCards(this.props.cards)}
          <Button
            //   onClick={handleShow}
            className="addCard"
            variant="secondary"
          >
            + Add List
          </Button>
        </div>
        <div className="trash">
          <h2 className="trashText">
            🗑️ TRASH CAN - Drag here to Delete - ... Persistent Data
            (postgreSQL) - authorization/multi-users/multi-boards coming soon?
          </h2>
        </div>
      </div>
    );
  }
}

// var BoardDropTarget = DropTarget(
//   [ItemTypes.CARD, ItemTypes.TASK],
//   boardTarget,
//   collect
// )(Boarddnd);
// const mapStateToProps = state => ({
//   cards: state.cards
// });
// export default Boarddnd;
// export default connect(
//   mapStateToProps,
//   {} //{ addCard }
// )(BoardDropTarget);

export default DropTarget(
  [ItemTypes.CARD, ItemTypes.TASK],
  boardTarget,
  collect
)(Boarddnd);
