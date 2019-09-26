export const getTasks
export const addTask = task => ({
  var formdata = new FormData();
  formdata.set("boardID", task.boardID);
  formdata.set("body", task.body);
  formdata.set("cardID", task.cardID);
  axios({
    method: "post",
    url: "http://127.0.0.1:5000/addTask",
    data: formdata
  })
    .then(res => {
      console.log(res);
      const extraTask = {
        boardID: res.data.boardID,
        body: tempTask,
        cardID: res.data.cardID,
        created: res.data.created,
        taskID: res.data.taskID,
        taskOrder: res.data.numTasks
      };
  type: ADD_TASK,
    payload: {

    }
});


const created = new Date().toUTCString();

    setShowTaskModal(false);
    var formdata = new FormData();
    formdata.set("boardID", card.boardID);
    formdata.set("body", tempTask);
    formdata.set("cardID", card.cardID);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/addTask",
      data: formdata
    })
      .then(res => {
        console.log(res);
        const extraTask = {
          boardID: res.data.boardID,
          body: tempTask,
          cardID: res.data.cardID,
          created: res.data.created,
          taskID: res.data.taskID,
          taskOrder: res.data.numTasks
        };
        console.log("added task:", extraTask);
        while (extraTask == undefined) {
          console.log("wait");
        }
        console.log(extraTask.taskOrder);
        setAllTasks([]);
        if (allTasks !== undefined) {
          setAllTasks([...Array.from(allTasks), extraTask]);
        } else {
          setAllTasks(extraTask);
        }
        // setAllTasks([]);
        // setAllTasks([...Array.from(allTasks), extraTask]);
      })
      .catch(err => console.log(err));