import { Router } from "express";
import todosRouter from "./todos.js";

const router = Router();
router.use("/todos", todosRouter);

export default router;
