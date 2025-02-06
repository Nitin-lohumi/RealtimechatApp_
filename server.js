import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./lib/connect.js";
import Message from "./model/message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
await connectDB();
const users = new Map();
io.on("connection", async (socket) => {
  io.emit("userCount", io.engine.clientsCount); 
  socket.on("userJoined", (username) => {
    if (!users.has(socket.id)) {
      users.set(socket.id, username || "Unknown User");
      console.log(`${username} joined`);
      socket.broadcast.emit("newUser", { username }); 
    }
  });
  socket.on("message", async (msg) => {
    try {
      const sendmsg = {
        name: msg.name || "Unknown",
        message: msg.message,
        time: new Date().toLocaleTimeString(),
      };
      const newMessage = new Message({
        SenderName: msg.name || "Unknown",
        message: msg.message,
        image: msg.image || null,
      });
      await newMessage.save();
      io.emit("message", sendmsg);
    } catch (error) {
      console.log("Error saving message:", error);
    }
  });
  socket.on("disconnect", () => {
    const username = users.get(socket.id) || "user";
    users.delete(socket.id);
    socket.broadcast.emit("userLeft", username);
    io.emit("userCount", io.engine.clientsCount);
  });
});
server.listen(4000, () => {
  console.log("Socket.IO server running on http://localhost:4000");
});
