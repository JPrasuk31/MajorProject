const socket = io("http://localhost:8000");
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("ting.mp3");

var messageHistory = []

const append = async (message, position) => {
    console.log("Append function called : ",message , position)
    // messageHistory.push(message)
    // if(messageHistory.length > 4){
    //     fetch("http://127.0.0.1:8001/gpt_response", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ chat: messageHistory })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("GPT  DATA  ",JSON.parse(data.gptResponse))
    //     })
    //     .catch(error => {
    //         alert("An error occurred while sending the message.");
    //         console.error(error);
    //     });
    // }

    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // if(position == 'left') {
    //     audio.play();
    // }
    return
}


form.addEventListener('submit', (e)=> {
    e.preventDefault();
    const message = messageInput.value; 
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value=''; 
})
const personName = prompt("Enter your name to join");
socket.emit("new-user-joined", personName);

socket.on("user-joined", name => {
    append(`${name} joined the chat`, 'right');
})

socket.on("receive", async(data) => {
    console.log("DATATATATAT : ",data)
    await append(`${data.name}: ${data.message}`, 'left');
})

socket.on("left", name => {
    // append(`${name} left the chat`, 'right');
    console.log("LEFT THE CHAT")
})

socket.on("manipulation", data => {
    console.log("Manipulation DaTA  : ",data)
    if(data.name == personName){
        alert(data.name + " Beware you may be getting manipulated")
    }
    
})