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

function deleteTask(t) {}
const trashTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      console.log("DID DROP ON TRASH");
      return;
    }
    const item = monitor.getItem();
    // console.log(item);
    // if (item.id == "card") {
    //   //   deleteCard(item.card);
    // } else if (item.id == "task") {
    //   //   deleteTask(item.task);
    // }
    console.log("Trash item", item);
    return { droppedOn: "Trash", moved: true };
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

class Trashdnd extends Component {
  render() {
    const {
      isOver,
      isOverCurrent,
      canDrop,
      connectDropTarget,
      itemType
    } = this.props;
    let backgroundColorTrash = "rgba(255,0,0,.5)";
    if (isOverCurrent || isOver) {
      if (itemType == ItemTypes.CARD || itemType == ItemTypes.TASK)
        backgroundColorTrash = "red";
    }
    return connectDropTarget(
      <div className="trash" style={{ backgroundColor: backgroundColorTrash }}>
        <h2 className="trashText">
          🗑️ TRASH CAN - Drag here to Delete - ... Persistent Data (postgreSQL)
          - authorization/multi-users/multi-boards coming soon?
        </h2>
      </div>
    );
  }
}

export default DropTarget(
  [ItemTypes.CARD, ItemTypes.TASK],
  trashTarget,
  collect
)(Trashdnd);
