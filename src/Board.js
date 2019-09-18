import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Cards from "./Cards";
import Tasks from "./Tasks";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";

function getStyle(backgroundColor) {
  return {
    position: "absolute",
    display: "flex",
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    height: "94.5%",
    // width: "auto",
    // maxWidth: "auto",
    padding: "5px",
    border: "5px solid orange",
    // overflowX: "auto",
    backgroundColor
  };
}
// const boardStyle = {
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: "center",
//   height: "25rem",
//   padding: "5px",
//   border: "1px solid orange"
// };

export default function Board(props) {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, obj }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      obj: monitor.getItemType()
    })
  });

  function renderCards(totalCards) {
    var cardList = [];
    if (totalCards !== undefined) {
      // props.cards.forEach(c => console.log(c));
      totalCards.forEach(c =>
        cardList.push(
          <Cards
            card={c}
            // nextCardID={props.nextCardID}
            // nextTaskID={props.nextTaskID}
            // numCards={props.numCards}
          />
        )
      );
    }
    return cardList;
  }

  let backgroundColor = "rgba(255,255,150,.5)";
  if (isOverCurrent || isOver) {
    if (obj == ItemTypes.CARD) backgroundColor = "lightgreen";
  }

  const [allCards, setAllCards] = useState(props.cards);
  // console.log("ALL CARDS");
  // console.log(allCards);
  // console.log(props.cards);
  const [show, setShow] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [cardTitle, setCardTitle] = useState("");

  const handleClose = () => setShow(false);
  function handleChange(e) {
    setTempTitle(e);
  }
  const handleSubmit = () => {
    const cardOrder = props.numCards + 1;
    const created = new Date().toUTCString();
    setCardTitle(tempTitle);
    setShow(false);
    var formdata = new FormData();
    formdata.set("boardID", props.boardID);
    formdata.set("cardOrder", cardOrder);
    formdata.set("title", tempTitle);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/addCard",
      data: formdata
    })
      .then(res => {
        console.log("IN NEW CARD");
        console.log(res);
        const extraCard = {
          boardID: res.data.boardID,
          cardID: res.data.cardID,
          cardOrder: res.data.cardOrder,
          created: res.data.created,
          numTasks: 0,
          tasks: [],
          title: tempTitle
        };
        setAllCards([...allCards, extraCard]);
      })
      .catch(err => console.log(err));
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 style={{ display: "flex", justifyContent: "center", height: "4vh" }}>
        KanBan Drag-n-Drop
      </h1>
      <div ref={drop} style={getStyle(backgroundColor)}>
        {renderCards(allCards)}
        <Button
          onClick={handleShow}
          variant="secondary"
          style={{
            margin: "10px",
            padding: "5px",
            minWidth: "100px",
            height: "40px",
            width: "120px",
            textAlign: "left"
          }}
        >
          + Add List
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <Form.Group controlId="formCardTitle">
                <Form.Control
                  // autofocus="true"
                  type="cardTitle"
                  // defaultValue={cardTitle}
                  placeholder={"Title..."}
                  onChange={e => handleChange(e.target.value)}
                  // ref={textInput}
                />
              </Form.Group>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "left",
            height: "7vh",
            margin: "0px",
            border: "4px dashed black",
            bottom: "0%",
            width: "100%",
            backgroundColor: "rgba(255,0,0,.5)"
          }}
        >
          <h3
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              top: "20%",
              overflow: "hidden"
            }}
          >
            🗑️ TRASH CAN - Drag here to Delete
          </h3>
        </div>
      </div>
    </DndProvider>
  );
}
