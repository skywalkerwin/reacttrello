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

const boardTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();

    return { moved: true };
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
      allCards.forEach(c => cardList.push(<Carddnd card={c} />));
    }
    return cardList;
  }
  render() {
    return (
      <div>
        {console.log(this.props.cards)}
        <h1 className="header">
          KanBan | Drag-n-Drop | Flask backend API / React frontend UI
        </h1>
        <div className="board">{this.drawCards(this.props.cards)}</div>
      </div>
    );
  }
}

// var BoardDropTarget = DropTarget(
//   [ItemTypes.CARD, ItemTypes.TASK],
//   boardTarget,
//   collect
// );
// const mapStateToProps = state => ({
//   cards: state.cards
// });
export default Boarddnd;
// export default connect(
//   mapStateToProps,
//   { addCard }
// )(boardDropTarget);
