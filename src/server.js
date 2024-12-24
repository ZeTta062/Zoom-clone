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

wss.on(
    "connection", (BackSocket) => {
    console.log("Connected to Browser ✅");

    BackSocket.on ("close", () => {
        console.log("Disconnected to Browser ❌");
    });

    BackSocket.on("message", (message) => {
        console.log(message.toString('utf8'));
    });
    
    BackSocket.send("hello!!");  // 백엔드 > 프런트
});

server.listen(3000, handleListen);