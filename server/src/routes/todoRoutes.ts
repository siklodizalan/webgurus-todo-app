import express from "express";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";
import {
  addTodo,
  deleteTodo,
  getTodos,
  setTodoCompleted,
} from "../services/todoService.js";
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

const router = express.Router();

router.use(verifyTokenMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    const priority = req.query.priority;
    if (typeof name !== "string") {
      res.status(500).json({ message: ERROR_MESSAGES.typeOfNameQuery });
      return;
    }
    const todos = await getTodos(name, priority as string[]);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const insertedTodo = await addTodo(
      req.body.name,
      req.body.priority,
      req.body.completed,
    );
    res.status(201).json(insertedTodo);
  } catch (err) {
    next(err);
  }
});

//@ts-ignore
router.put("/:id", async (req, res, next) => {
  try {
    const updateSuccessful = await setTodoCompleted(
      req.params.id,
      req.body.completed,
    );

    if (!updateSuccessful) {
      return res.status(404).json({ message: ERROR_MESSAGES.todoNotFound });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteSuccessful = await deleteTodo(req.params.id);
    if (deleteSuccessful) {
      res.status(200).json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: ERROR_MESSAGES.todoNotFound });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
