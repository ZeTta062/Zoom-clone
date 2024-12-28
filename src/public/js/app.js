const frontSocket = io();

const welcome = document.getElementById("welcome");
const nameForm = welcome.querySelector("#name")
const greeting = welcome.querySelector("#greeting");
const room = document.getElementById("room"); 

room.hidden = true;

let roomName;

 function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
} 

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;

    const msgForm = room.querySelector("#message") 
    msgForm.addEventListener("submit", (event) => {           // message
        event.preventDefault();
        const input = room.querySelector("#message input");
        const value = input.value;
        frontSocket.emit("new_message", input.value, roomName, () => {
            addMessage(`You: ${value}`);
        });
        input.value = "";
    });
}

nameForm.addEventListener("submit", (event) => {        //nickname
    event.preventDefault();
    const input = document.querySelector("#name input");
    frontSocket.emit("nickname", input.value);
});

greeting.addEventListener("submit", (event) => {
    event.preventDefault();
    // const greeting = document.querySelector("#greeting");
    const input = greeting.querySelector("input");
    frontSocket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});

 frontSocket.on("welcome", (user) => {
    addMessage(`${user} 님이 들어왔습니다.`);
}) 

frontSocket.on("bye", (user) => {
    addMessage(`${user} 님이 나갔습니다.`);
}) 

frontSocket.on("new_message", addMessage);

frontSocket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});
