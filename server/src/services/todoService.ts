import { connectToDatabase } from "../database/connection.js";
import { Db, ObjectId } from "mongodb";

export async function getTodos(name: string, priority: string[], userId: string) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");
  const todos = await todosCollection
    .find({
      $and: [
        { name: new RegExp(name, "i") }, 
        { priority: { $in: priority } },
        { userId: userId },
      ],
    })
    .sort({ completed: 1 })
    .toArray();
  return todos;
}

export async function addTodo(
  name: string,
  priority: string,
  completed: boolean,
  userId: string
) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");
  const newTodo = { name, priority, completed, userId };

  const result = await todosCollection.insertOne(newTodo);
  const insertedTodo = await todosCollection.findOne({
    _id: new ObjectId(result.insertedId),
  });
  return insertedTodo;
}

export async function setTodoCompleted(todoId: string, completed: boolean, userId: string) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");
  const updatedTodo = await todosCollection.findOne({
    _id: new ObjectId(todoId),
  });

  if (updatedTodo?.userId !== userId) {
    throw "No authorization to update this to-do.";
  }

  const result = await todosCollection.updateOne(
    { _id: new ObjectId(todoId) },
    { $set: { completed: completed } },
  );

  return result.matchedCount !== 0;
}

export async function deleteTodo(todoId: string, userId: string) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");
  const deletedTodo = await todosCollection.findOne({
    _id: new ObjectId(todoId),
  });

  if (deletedTodo?.userId !== userId) {
    throw new Error("No authorization to delete this to-do.");
  }

  const result = await todosCollection.deleteOne({
    _id: new ObjectId(todoId),
  });
  return result.deletedCount === 1;
}
