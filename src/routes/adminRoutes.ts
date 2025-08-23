import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  deleteTodo,
  deleteUser,
  getAllUsersStats,
  getTodoStats,
} from "../controllers/adminController";

const router = express.Router();

router.use(protect);

router.get("/users/stats", getAllUsersStats);
router.get("/todos/stats", getTodoStats);
router.delete("/user/:id", deleteUser);
router.delete("/todo/:id", deleteTodo);

export default router;
