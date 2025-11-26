import { Server } from "socket.io";
import { connectRedis } from "../server.js";

let io; 

export const initSocket = async (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  const redis = await connectRedis();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_chat", async (userId) => {
      await redis.sAdd("online_users", userId);
      socket.join("global");
    });

    socket.on("send_message", (messageData) => {
      io.to("global").emit("receive_message", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io; 
