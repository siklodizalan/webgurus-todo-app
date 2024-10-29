export interface UserData {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}

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
}
