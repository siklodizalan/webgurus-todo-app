import { client } from "../axiosClient.js";
import type { LoginResponse } from "../models/User";

const userService = {
  async getUserData() {
    try {
      const response = await client.get('/profile');
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async loginUser(name: string, password: string): Promise<LoginResponse> {
    try {
      const response = await client.post('/login', { name, password });
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  },

  async registerUser(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<LoginResponse> {
    try {
      const response = await client.post('/register', {
        name,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await client.delete(`/user/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async uploadImage(selectedFile: File) {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const response = await client.post('/file-upload', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  }
};

export default userService;
