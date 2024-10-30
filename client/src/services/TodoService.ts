import { client } from "../client.js";
import type Todo from "../models/ToDo";
import type { PriorityType } from "../models/ToDo";
import TodoData from "../models/ToDo";

const todoService = {
  async fetchTodos(name?: string, priority?: string[]): Promise<Todo[]> {
    try {
      const response = await client.get<TodoData[]>('/todos', { params: { name, priority } });
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  },

  async addTodo(name: string, priority: PriorityType): Promise<Todo> {
    try {
      const response = await client.post<Omit<TodoData, "_id">, TodoData>('/todos', {
        name,
        priority,
        completed: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  },

  async updateTodo(id: string, completed: boolean): Promise<void> {
    try {
      const response = await client.put<Pick<TodoData, "completed">, void>(`/todos/${id}`, { completed });
      return response.data;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      await client.delete(`/todos/${id}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
};

export default todoService;
