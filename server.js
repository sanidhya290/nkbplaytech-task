import mongoose from "mongoose";
import { createClient } from "redis";

let redisClient; 

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};

export const connectRedis = async () => {
  try {
    if (!redisClient) {
      redisClient = createClient({
        username: "default",
        password: "vOec1yCr1FmyQYnkTAroRU1Vp1iHQ2Ju",
        socket: {
          host: "redis-19230.c9.us-east-1-2.ec2.cloud.redislabs.com",
          port: 19230,
        },
      });

      redisClient.on("error", (err) => console.log("Redis Error:", err));
      await redisClient.connect();

      console.log("Redis connected");
    }

    return redisClient;
  } catch (error) {
    console.log("Redis error:", error);
  }
};
