import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../database/connection.js";

const router = express.Router();

router.get("/todos", async (req, res) => {
  try {
    const name = req.query.name;
    const todosCollection = db.collection("todos");
    const todos = await todosCollection
      .find({ name: new RegExp(name, "i") })
      .sort({ completed: 1 })
      .toArray();

    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/todos", async (req, res) => {
  try {
    const todosCollection = db.collection("todos");
    const newTodo = req.body;

    const result = await todosCollection.insertOne(newTodo);
    const insertedTodo = await todosCollection.findOne({
      _id: new ObjectId(result.insertedId),
    });
    res.status(201).json(insertedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/todos/:id", async (req, res) => {
  const { completed } = req.body;
  const todoId = req.params.id;

  try {
    const result = await db
      .collection("todos")
      .updateOne(
        { _id: new ObjectId(todoId) },
        { $set: { completed: completed } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ message: "Failed to update todo" });
  }
});

router.delete("/todos/:id", async (req, res) => {
  try {
    const todosCollection = db.collection("todos");
    const todoId = req.params.id;

    const result = await todosCollection.deleteOne({
      _id: new ObjectId(todoId),
    });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
