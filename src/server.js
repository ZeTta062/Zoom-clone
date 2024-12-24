import http from "http";
import { WebSocketServer } from 'ws';
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); //CATCHALL URL

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);          //express
const wss = new WebSocketServer({server});  //webSocket
const BackSockets = [];

wss.on("connection", (BackSocket) => {
    BackSockets.push(BackSocket);

    console.log("Connected to Browser ✅");
    BackSocket["nickname"] = "Anon";                // 알수없는 사용자
    BackSocket.on ("close", () => {
        console.log("Disconnected to Browser ❌");
    });

    BackSocket.on("message", (msg) => {
        const message = JSON.parse(msg);     // string > element
        switch(message.type) {
            case "new_message":      // 백엔드 > 프런트 메시지
                BackSockets.forEach(aSocket => 
                    aSocket.send(`${BackSocket.nickname}: ${message.payload}`));
                break;
            case "nickname":           // 백엔드 > 프런트 ID
                BackSocket["nickname"] = message.payload;
                
        }
    });
});

server.listen(3000, handleListen);

