import axios from '../axios.js';
import Todo, { PriorityType } from '../models/ToDo';

const API_URL = 'http://localhost:3000/todos';

class TodoService {
    async fetchTodos(name?: string, priority?: string[]): Promise<Todo[]> {
        try {
          const response = await axios.get(API_URL, { params: { name, priority } });
          return response.data;
        } catch (error) {
          console.error('Error fetching todos:', error);
          throw error;
        }
    }
    
    async addTodo(name: string, priority: PriorityType): Promise<Todo> {
    try {
        const response = await axios.post(API_URL, { name, priority, completed: false });
        return response.data;
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
    }

    async updateTodo(id: string, completed: boolean): Promise<void> {
        try {
            const response = await axios.put(`${API_URL}/${id}`, { completed });
            return response.data;
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    };
    
    async deleteTodo(id: string): Promise<void> {
        try {
          await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
          console.error('Error deleting todo:', error);
          throw error;
        }
    }
}

export default new TodoService();