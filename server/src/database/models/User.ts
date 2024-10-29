export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  profileImageUrl: string;
};

export type UserWithoutPassword = Omit<User, "password">;

export type LoginResponse = {
  userData: UserWithoutPassword;
  token: string;
};
