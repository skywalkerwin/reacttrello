import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import testBoard from "./testdata";
import { ItemTypes } from "./Constants";
import Cards from "./Cards";
import Tasks from "./Tasks";
import axios from "axios";
function getStyle(backgroundColor) {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "80vh",
    padding: "5px",
    border: "3px solid orange",
    backgroundColor
  };
}
const boardStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  height: "25rem",
  padding: "5px",
  border: "1px solid orange"
};

export default function Board() {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, obj }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.TASK],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("did drop");
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

  function renderCards() {
    var cardList = [];
    axios.get("http://127.0.0.1:5000/boardData").then(res => {
      // console.log(res);
      const cardres = res.data.cards;
      const taskres = res.data.tasks;
      // console.log(cardres);
      cardres.forEach(c => {
        // const tempTasks = taskres.filter(t => t[1] == c[0]);
        // console.log(tempTasks);
        // const tempCard = {
        //   id: c[0],
        //   title: c[1],
        //   num_tasks: c[2],
        //   created: c[3],
        //   tasks: tempTasks
        // };
        // console.log(tempCard);
        // const tempData = [c, tempTasks];
        // const tempData = c[1];
        // console.log(tempData);
        const tempCard = { id: c[0], title: c[1] };
        console.log(tempCard);
        // cardList.push(<Cards card={tempCard} />);
        // cardList.push(<div>{tempCard.title} </div>);
        testBoard.cards.forEach(cc => {
          console.log(cc);
          cardList.push(<Cards card={cc} />);
        });
      });
    });
    console.log(cardList);
    // testBoard.cards.forEach(c => {
    //   console.log(c);
    //   cardList.push(<Cards card={c} />);
    // });
    // console.log(cardList);
    // cardList.push(
    //   <button
    //     style={{
    //       margin: "10px",
    //       padding: "5px",
    //       width: "85px",
    //       height: "30px",
    //       textAlign: "left"
    //     }}
    //   >
    //     + Add List
    //   </button>
    // );
    return cardList;
  }

  function renderTasks() {
    return <Tasks />;
  }
  let backgroundColor = "rgba(255,255,150,.5)";
  if (isOverCurrent || isOver) {
    if (obj == ItemTypes.CARD) backgroundColor = "lightgreen";
  }

  // function apidata() {
  //   axios.get("http://127.0.0.1:5000/boardData").then(res => {
  //     console.log(res);
  //     console.log(res.data);
  //     const cardres = res.data["cards"];
  //     console.log(cardres);
  //     cardres.forEach(x => console.log(x[0], x[1], x[2], x[3], x[4]));
  //   });
  // }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 style={{ display: "flex", justifyContent: "center", height: "3vh" }}>
        KanBan
      </h1>
      <div ref={drop} style={getStyle(backgroundColor)}>
        {renderCards()}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "9vh",
          margin: "5px",
          border: "2px solid red"
        }}
      >
        <h1>🗑️ TRASH CAN - implement functionality</h1>
      </div>
    </DndProvider>
  );
}
