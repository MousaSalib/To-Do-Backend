import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validation/todoValidation";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  toggleTodoCompletion,
  updateTodo,
} from "../controllers/todoController";

const router = express.Router();

router.use(protect);

router.post("/", validate(createTodoSchema), createTodo);
router.get("/", getTodos);
router.get("/:id", getTodo);
router.put("/:id", validate(updateTodoSchema), updateTodo);
router.patch("/complete/:id", toggleTodoCompletion);
router.delete("/:id", deleteTodo);

export default router;
