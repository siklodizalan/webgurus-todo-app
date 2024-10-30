export interface UserData {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  role: Role;
}

export type Role = "USER" | "ADMIN" | "VISITOR";

export interface LoginRequest {
  name: String;
  password: String; 
}

export interface LoginResponse {
  userData: UserData;
  token: string;
}

export interface RegisterRequest {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: Role,
}

export interface RoleChangeRequest {
  userId: string,
  newRole: Role,
}
