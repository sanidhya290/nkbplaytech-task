import User from "../model/UserModel.js";
import { connectRedis } from "../server.js";
import bcrypt from "bcrypt";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        sucess: false,
        message: "need all the fields",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        sucess: false,
        message: "user already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashpassword });
    res.status(201).json({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getalluser = async (req, res) => {
  try {
    const redis = await connectRedis();
    const cashedData = await redis.get("all_users");
    if (cashedData) {
      return res.status(200).json({
        success: true,
        source: "Cache",
        users: JSON.parse(cashedData),
      });
    }
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found in the database",
      });
    }
    await redis.setEx("all_users", 20, JSON.stringify(users));
    res.status(200).json({
      success: true,
      source: "mongoDB",
      message: "this are all the users",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
