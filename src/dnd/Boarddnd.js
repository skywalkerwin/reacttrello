import React, { useState, useEffect } from "react";
import thunk from "redux-thunk";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./Constants";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import React, { Component } from "react";

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
    this.props = {};
  }
  render() {
    return <div></div>;
  }
}

var boardDropTarget = DropTarget(
  [ItemTypes.CARD, ItemTypes.TASK],
  boardTarget,
  collect
);
const mapStateToProps = state => ({
  cards: state.cards
});
export default connect(
  mapStateToProps,
  { addCard }
)(boardDropTarget);
