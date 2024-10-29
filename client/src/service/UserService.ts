import { client } from "../client.js";
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
} from "../models/User";

const userService = {
  async getUserData() {
    try {
      const response = await client.get<LoginResponse>("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async loginUser(name: string, password: string): Promise<LoginResponse> {
    try {
      const response = await client.post<LoginRequest, LoginResponse>(
        "/login",
        { name, password }
      );

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
      const response = await client.post<RegisterRequest, LoginResponse>(
        "/register",
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  async deleteUser(): Promise<void> {
    try {
      await client.delete("/user");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async uploadImage(selectedFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const response = await client.post<FormData, string>(
        "/file-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  },
};

export default userService;
