import axios from '../axios';
import type { LoginResponse } from '../models/User';

const API_URL = 'http://localhost:3000';

class UserService {

  async getUserData() {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async loginUser(name: string, password: string): Promise<LoginResponse> {
      try {
        const response = await axios.post(`${API_URL}/login`, {name, password});
        return response.data;
      } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
      }
  }
  
  async registerUser(name: string, email: string, password: string, confirmPassword: string): Promise<LoginResponse> {
      try {
          const response = await axios.post(`${API_URL}/register`, { name, email, password, confirmPassword });
          return response.data;
      } catch (error) {
          console.error('Error adding todo:', error);
          throw error;
      }
  }
  
  async deleteUser(id: string): Promise<void> {
      try {
        await axios.delete(`${API_URL}/${id}`);
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
      }
  }

  async uploadImage(selectedFile: File, imageUrl: string) {
    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/file-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }
}

export default new UserService();