const FrontSocket = new WebSocket(`ws://${window.location.host}`);

FrontSocket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
} );

FrontSocket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

FrontSocket.addEventListener("close", () => {
    console.log("Disconnected to Server ❌");
});

setTimeout(() => {
    FrontSocket.send("hello from the browser!");  // 프런트 > 백에늗
}, 10000);