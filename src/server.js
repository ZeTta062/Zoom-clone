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

function publicRooms() {
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push(key);
      }
    });
    return publicRooms;
  }

wsServer.on("connection", (BackSocket) => {
    BackSocket["nickname"] = "Anonymous";
    wsServer.sockets.emit("room_change", publicRooms());    // 서버에 들어오면 바로 룸을 알 수 있음
    BackSocket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event:${event}`);
    });
    BackSocket.on("enter_room", (roomName, done) => {
        // front에 있는 emit에 적은 function을 back에서 제어 할 수 있다
        BackSocket.join(roomName);
        done();
        BackSocket.to(roomName).emit("welcome", BackSocket.nickname);
        
    });
    BackSocket.on("disconnecting", () => {
        BackSocket.rooms.forEach((room) => BackSocket.to(room).emit("bye", BackSocket.nickname));
    });
    BackSocket.on("disconnect", () => {
      wsServer.sockets.emit("room_change", publicRooms());
    });
    BackSocket.on("new_message", (msg, room, done) => {
        BackSocket.to(room).emit("new_message", `${BackSocket.nickname}: ${msg}`);
        done();
    });
    BackSocket.on("nickname", (nickname) => (BackSocket["nickname"] = nickname));
});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);


