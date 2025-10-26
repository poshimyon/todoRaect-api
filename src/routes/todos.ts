import { Router } from "express";
import { getTodos, addTodo } from "../controllers/todosController.js";

const router = Router();

router.get("/", getTodos);
router.post("/", addTodo);

export default router;
