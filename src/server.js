import http from "http";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); //CATCHALL URL


const httpServer = http.createServer(app);          //express
const wsServer = SocketIO(httpServer);              //SocketIO server

wsServer.on("connection", (BackSocket) => {
    BackSocket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });
    BackSocket.on("enter_room", (roomName, done) => {
        // front에 있는 emit에 적은 function을 back에서 제어 할 수 있다
        BackSocket.join(roomName);
        done();
    });
});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);



/* const wss = new WebSocketServer({server});  //webSocket
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
                    */