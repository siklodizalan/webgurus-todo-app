import { connectToDatabase } from "../database/connection.js";
import { Db, ObjectId } from "mongodb";

export async function getTodos(name: string, priority: string[]) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");
  const todos = await todosCollection
    .find({
      $and: [{ name: new RegExp(name, "i") }, { priority: { $in: priority } }],
    })
    .sort({ completed: 1 })
    .toArray();
  return todos;
}

export async function addTodo(
  name: string,
  priority: string,
  completed: boolean,
) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");
  const newTodo = { name, priority, completed };

  const result = await todosCollection.insertOne(newTodo);
  const insertedTodo = await todosCollection.findOne({
    _id: new ObjectId(result.insertedId),
  });
  return insertedTodo;
}

export async function setTodoCompleted(todoId: string, completed: boolean) {
  const db: Db = await connectToDatabase();
  const result = await db
    .collection("todos")
    .updateOne(
      { _id: new ObjectId(todoId) },
      { $set: { completed: completed } },
    );

  return result.matchedCount !== 0;
}

export async function deleteTodo(todoId: string) {
  const db: Db = await connectToDatabase();
  const todosCollection = db.collection("todos");

  const result = await todosCollection.deleteOne({
    _id: new ObjectId(todoId),
  });
  return result.deletedCount === 1;
}
