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
    justifyContent: "left",
    height: "94%",
    bottom: "0",
    // width: "auto",
    // maxWidth: "auto",
    minWidth: "100vw",
    // padding: "5px",
    border: "4px solid grey",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    overflow: "hidden",
    backgroundColor
  };
}

export default function Board(props) {
  const [hasDropped, setHasDropped] = useState(false);
  const [{ isOver, isOverCurrent, obj }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("DROPPED ON BOARD");
        console.log(item);
        console.log("dropped on...");
        console.log(monitor.getDropResult());
        return;
      }
      console.log("DROPPED ON BOARD");
      setHasDropped(true);
      return { droppedOn: "board" };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      obj: monitor.getItemType()
    })
  });
  function trashedTask(drg) {
    const delTask = {
      boardID: drg.boardID,
      body: drg.body,
      cardID: drg.cardID,
      created: drg.created,
      taskID: drg.taskID,
      taskOrder: drg.taskOrder
    };
    var newCards = [];
    allCards.forEach(c => {
      if (c.cardID == delTask.cardID) {
        var tempCard = c;
        const ttasks = c.tasks;
        // tempCard.task = c.tasks;
        // console.log("ctasks:", c.tasks);
        // console.log("ttasks:", ttasks);
        tempCard.tasks = [];
        // ttasks.forEach(t => console.log(t));
        ttasks.forEach(t => {
          console.log("task:", t);
          if (t.taskOrder > delTask.taskOrder) {
            const tempTask = {
              boardID: t.boardID,
              body: t.body,
              cardID: t.cardID,
              created: t.created,
              taskID: t.taskID,
              taskOrder: t.taskOrder - 1
            };
            tempCard.tasks.push(tempTask);
          } else if (t.taskID != delTask.taskID) {
            tempCard.tasks.push(t);
          }
        });
        // console.log("tempCard:", tempCard);
        newCards.push(tempCard);
      } else {
        newCards.push(c);
      }
    });
    const retCards = newCards;
    console.log("retCards:", retCards);
    return retCards;
  }
  const [hasDroppedTrash, setHasDroppedTrash] = useState(false);
  const [{ isOverTrash, isOverCurrentTrash, objTrash }, dropTrash] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("DID DROP BOARD-----");
        return;
      }
      console.log("deleted item:", item);
      const newCards = trashedTask(item);
      setAllCards([]);
      setAllCards(newCards);
      setHasDroppedTrash(true);
      return { droppedOn: "trash" };
    },
    collect: monitor => ({
      isOverTrash: monitor.isOver(),
      isOverCurrentTrash: monitor.isOver({ shallow: true }),
      objTrash: monitor.getItemType()
    })
  });

  function renderCards(totalCards) {
    var cardList = [];
    if (totalCards !== undefined) {
      totalCards.forEach(c =>
        cardList.push(
          <Cards
            card={c}
            updateCard={props.updateCard}
            updatedCardID={props.updatedCardID}
            resetCheck={props.resetCheck}
          />
        )
      );
    }
    return cardList;
  }

  // let backgroundColor = "rgba(255,255,150,.5)";
  let backgroundColor = "rgba(0,100,255,.5)";
  let backgroundColorTrash = "rgba(255,0,0,.5)";
  if (isOverCurrentTrash || isOverTrash) {
    if (objTrash == ItemTypes.CARD || objTrash == ItemTypes.TASK)
      backgroundColorTrash = "red";
  }

  const [allCards, setAllCards] = useState(props.cards);
  const [show, setShow] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [cardTitle, setCardTitle] = useState("");

  const handleClose = () => setShow(false);
  function handleChange(e) {
    setTempTitle(e);
  }
  const handleSubmit = () => {
    // const cardOrder = props.numCards + 1;
    const created = new Date().toUTCString();
    setCardTitle(tempTitle);
    setShow(false);
    var formdata = new FormData();
    formdata.set("boardID", props.boardID);
    // formdata.set("cardOrder", cardOrder);
    formdata.set("title", tempTitle);
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
        setAllCards([...allCards, extraCard]);
      })
      .catch(err => console.log(err));
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1
        style={{
          backgroundColor: "lightgray",
          display: "flex",
          justifyContent: "center",
          height: "6vh"
        }}
      >
        KanBan | Drag-n-Drop | Flask backend API / React frontend UI
      </h1>
      <div ref={drop} style={getStyle(backgroundColor)}>
        {renderCards(allCards)}
        <Button
          onClick={handleShow}
          variant="secondary"
          style={{
            borderRadius: "5px",
            margin: "10px",
            padding: "5px",
            minWidth: "100px",
            height: "40px",
            width: "120px"
            // textAlign: "left"
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
          ref={dropTrash}
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            height: "8vh",
            margin: "0px",
            border: "5px dashed black",
            bottom: "0",
            left: "0",
            right: "0",
            width: "100%",
            borderRadius: "6px",
            // overflow: "visible",
            backgroundColor: backgroundColorTrash
          }}
        >
          <h2
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              top: "20%",
              overflow: "hidden"
            }}
          >
            🗑️ TRASH CAN - Drag here to Delete - ... Persistent Data
            (postgreSQL) - authorization/multi-users/multi-boards coming soon?
          </h2>
        </div>
      </div>
    </DndProvider>
  );
}
