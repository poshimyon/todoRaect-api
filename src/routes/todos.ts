import { Router } from "express";
import { getTodos } from "../controllers/getTodosController.js";
import { addTodo } from "../controllers/addTodoController.js";
import { updateTodo } from "../controllers/updateTodoController.js";
import { deleteTodo } from "../controllers/deleteTodoController.js";

const router = Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
