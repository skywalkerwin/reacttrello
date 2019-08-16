import React, { Component } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";

export default class Cards extends Component {
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        card
      </div>
    );
  }
}
