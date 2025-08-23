import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User";
import Todo from "../models/Todo";

export const getAllUsersStats = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.userRole;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({ role: "user" }).select(
      "-password -otp -otpExpires"
    );
    const count = await User.countDocuments({ role: "user" });
    const verifiedCount = await User.countDocuments({
      role: "user",
      isVerified: true,
    });
    const unverifiedCount = await User.countDocuments({
      role: "user",
      isVerified: false,
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "All Users Stats",
      users,
      count,
      verifiedCount,
      unverifiedCount,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getTodoStats = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.userRole;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const todos = await Todo.find().populate("user", "name email profileImage");
    const count = await Todo.countDocuments();
    const completedCount = await Todo.countDocuments({ completed: true });
    const pendingCount = await Todo.countDocuments({ completed: false });

    if (todos.length === 0) {
      return res.status(404).json({ message: "No todos found" });
    }

    return res.status(200).json({
      message: "All Todos",
      todos,
      count,
      completedCount,
      pendingCount,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.userRole;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.userRole;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await Todo.findByIdAndDelete(todoId);

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
