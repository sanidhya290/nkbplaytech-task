import { connectRedis } from "../server.js";
import { getIO } from "../socket/socket.js";

export const joinChatAPI = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId required",
      });
    }

    const redis = await connectRedis();
    await redis.sAdd("online_users", userId);

    return res.status(200).json({
      success: true,
      message: `User ${userId} is now online`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendMessageAPI = async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({
        success: false,
        message: "user and message are required",
      });
    }

    const io = getIO(); 

    io.to("global").emit("receive_message", { user, message });

    return res.status(200).json({
      success: true,
      message: "Message broadcasted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOnlineUsers = async (req, res) => {
  try {
    const redis = await connectRedis();
    const users = await redis.sMembers("online_users");

    res.status(200).json({
      success: true,
      onlineUsers: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
