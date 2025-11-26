import express from "express";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

import { dbConnection, connectRedis } from "./server.js";
import { initSocket } from "./socket/socket.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use("/api/v1/user", userRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

dbConnection();
connectRedis();

initSocket(server);

export { server };
