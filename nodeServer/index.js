// Node server which will handle Socket IO connections
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });
const users = {};
var messageHistory = [];

function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

async function chatController(message, sender){
  // console.log("Chat controller function called : ",message , sender)
  messageHistory.push(sender + " : " + message)
  if(messageHistory.length > 2){
    return await fetch("http://127.0.0.1:8001/gpt_response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat: messageHistory })
    })
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data.gptResponse)
        data.started = true
        console.log("GPT  DATA  ", data)
        return data
    })
    .catch(error => {
        alert("An error occurred while sending the message.");
        console.error(error);
    });
}else {
  return  {started : false}
}
}

io.on("connection", socket => {
    socket.on("new-user-joined", name => {
        users[socket.id] = name; // Append to users.
        socket.broadcast.emit("user-joined", name) // Informs all the users about the new user, except the one joined
    });

    socket.on("send", async (message) => {
      console.log ("SOCKET send called message : ", message, users[socket.id] , typeof(users[socket.id]))
      socket.broadcast.emit("receive", {message: message, name: users[socket.id]})
      let gptResponse = await chatController(message , users[socket.id])
      console.log("IN send gpt respionse: ", gptResponse)
      if(gptResponse.started == true){
        console.log("Started true")
        if(gptResponse.manipulation == true){
          console.log("Manipulation true")
          sleep(300)
          io.emit("manipulation", {manipulation: true, name: gptResponse.Person})
        }
      }
    });

    socket.on("disconnect", message => {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    })
})

