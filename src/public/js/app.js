const messageList = document.querySelector("ul");
const idForm = document.querySelector("#ID");
const messageForm = document.querySelector("#message");

const FrontSocket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {       // element > string
    const msg = {type, payload};
    return JSON.stringify(msg);
}


FrontSocket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
} );

FrontSocket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
    // console.log("New message: ", message.data);
});

FrontSocket.addEventListener("close", () => {
    console.log("Disconnected to Server ❌");
});

messageForm.addEventListener("submit", (e) => {     // 메시지
    e.preventDefault();
    const input = messageForm.querySelector("input");
    FrontSocket.send(makeMessage("new_message",input.value));      // 프런트 > 백엔드
    input.value = "";
})

idForm.addEventListener("submit", (e) => {              // ID
    e.preventDefault();
    const input = idForm.querySelector("input");
    FrontSocket.send(makeMessage("nickname",input.value));
    input.value = "";
})