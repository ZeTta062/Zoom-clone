const frontSocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room"); 

room.hidden = true;

let roomName;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    frontSocket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});