import bodyParser from "body-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import socketio from "socket.io";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser());

app.post("/chat", (req: Request, res: Response) => {
  console.log("body", req.body);
  postIO(req.body);
  res.status(200).json({ message: "success" });
});

const httpServer = app.listen(port, (err?: any) => {
  if (err) throw err;
  console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
});

const io = socketio.listen(httpServer);

io.on("connection", (socket: socketio.Socket) => {
  console.log("id: " + socket.id + " is connected");
});

const postIO = (data) => {
  io.emit("update-data", data);
};
