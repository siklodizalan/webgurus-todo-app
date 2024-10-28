import express from "express";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";
import { addTodo, deleteTodo, getTodos, setTodoCompleted } from "../services/todoService.js";

const router = express.Router();

router.use(verifyTokenMiddleware);

router.get("/", async (req, res) => {
  try {
    const name = req.query.name;
    const priority = req.query.priority;
    if (typeof name !== "string") {
      res.status(500).json({ message: 'Type of name query is not string!' });
      console.log("itt");
      return;
    }
    // if (typeof priority !== "string[]") {
    //   res.status(500).json({ message: 'Type of priority query is not string[]!' });
    //   return;
    // }
    const todos = await getTodos(name, priority as string[]);
    res.status(200).json(todos);
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
});

router.post("/", async (req, res) => {
  try {
    const insertedTodo = await addTodo(req.body.name, req.body.priority, req.body.completed);
    res.status(201).json(insertedTodo);
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
});

//@ts-ignore
router.put("/:id", async (req, res) => {
  try {
    const updateSuccessful = await setTodoCompleted(req.params.id, req.body.completed);

    if (!updateSuccessful) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteSuccessful = await deleteTodo(req.params.id);
    if (deleteSuccessful) {
      res.status(200).json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
});

export default router;
