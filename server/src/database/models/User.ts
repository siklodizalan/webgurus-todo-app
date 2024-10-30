export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  profileImageUrl: string;
  role: Role;
};

export type UserWithoutPassword = Omit<User, "password">;

export type LoginResponse = {
  userData: UserWithoutPassword;
  token: string;
};

export type Role = "USER" | "ADMIN";
