import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Todo from "../models/Todo";
import mongoose from "mongoose";
import { parse } from "date-fns";
import User from "../models/User";

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.userId!;

    const format = "dd/MM/yyyy HH:mm";

    const start = parse(startDate, format, new Date());
    const end = parse(endDate, format, new Date());

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use dd/MM/yyyy HH:mm" });
    }

    const now = new Date();
    if (start < now) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past" });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const diffMs = end.getTime() - start.getTime();

    const todo = await Todo.create({
      user: new mongoose.Types.ObjectId(userId),
      title,
      description,
      startDate: start,
      endDate: end,
      durationInDays: Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
      durationInHours: Math.ceil(diffMs / (1000 * 60 * 60)),
      durationInMinutes: Math.ceil(diffMs / (1000 * 60)),
    });

    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

    if (!todos || todos.length === 0) {
      return res.status(404).json({ message: "No todos found" });
    }

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;
    const { title, description, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (startDate && endDate) {
      const format = "dd/MM/yyyy HH:mm";
      const start = parse(startDate, format, new Date());
      const end = parse(endDate, format, new Date());

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid date format. Use dd/MM/yyyy HH:mm" });
      }

      const now = new Date();
      if (start < now) {
        return res
          .status(400)
          .json({ message: "Start date cannot be in the past" });
      }

      if (end <= start) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      const diffMs = end.getTime() - start.getTime();

      updateData.startDate = start;
      updateData.endDate = end;
      updateData.durationInDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      updateData.durationInHours = Math.ceil(diffMs / (1000 * 60 * 60));
      updateData.durationInMinutes = Math.ceil(diffMs / (1000 * 60));
    }

    let todo;
    if (user.role === "admin") {
      todo = await Todo.findByIdAndUpdate(
        todoId,
        { $set: updateData },
        { new: true }
      );
    } else {
      todo = await Todo.findOneAndUpdate(
        { _id: todoId, user: userId },
        { $set: updateData },
        { new: true }
      );
    }

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or not allowed" });
    }

    res.json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const toggleTodoCompletion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const todoId = req.params.id;

    const user = await User.findById(userId);
    const todo = await Todo.findOne({ _id: todoId });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (
      user._id.toString() !== todo?.user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ message: "Todo completion status updated", todo });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    let todo;

    if (user.role === "admin") {
      todo = await Todo.findByIdAndDelete(todoId);
    } else {
      todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
    }

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or not allowed" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

