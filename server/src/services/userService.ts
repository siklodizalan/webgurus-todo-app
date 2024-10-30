import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database/connection.js";
import bcrypt from "bcryptjs";
import { Db, ObjectId } from "mongodb";
import { validateUser } from "../../../shared/utils/validationUtil.js";
import { LoginResponse, User } from "../database/models/User.js";
import { PORT } from "../index.js";
import path from "path";
import fs from "fs/promises";
import type { Role } from "../database/models/User.js";

export async function uniqueUser(username: string, email: string) {
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");
  const existingUser = await userCollection.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new Error("An account with this username or email already exists.");
  }
  return true;
}

export async function getAllUsers() {
  const db: Db = await connectToDatabase();
  const usersCollection = db.collection("users");
  
  const users = await usersCollection.find({}).toArray();
  return users;
}

export async function profile(userId: string) {
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (user === null) {
    throw new Error("No such user!");
  }

  const token = jwt.sign(user, "supersecretkey");
  const profileResponse: LoginResponse = {
    userData: {
      _id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: `http://localhost:${PORT}${user.profileImageUrl}`,
      role: user.role,
    },
    token,
  };

  return profileResponse;
}

export async function saveProfileImageToUser(userId: string, imageUrl: string) {
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");

  await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { profileImageUrl: imageUrl } },
  );
}

export async function login(name: string, password: string) {
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");
  const user = await userCollection.findOne({ name });
  if (user === null) {
    throw new Error("No such user!");
  }
  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    throw new Error("Invalid password!");
  }
  const token = jwt.sign(user, "supersecretkey");
  const loginResponse: LoginResponse = {
    userData: {
      _id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: `http://localhost:${PORT}${user.profileImageUrl}`,
      role: user.role,
    },
    token,
  };
  return loginResponse;
}

export async function register(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: Role,
) {
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  if (confirmPassword !== password) {
    throw new Error("Password and confirm password doesn't match");
  }
  const hash = await bcrypt.hash(password, salt);
  await uniqueUser(name, email);
  validateUser(email, password);
  password = hash;

  const newUser = { name, email, password, role };

  const result = await userCollection.insertOne(newUser);
  const insertedUserPayload = await userCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(result.insertedId) },
      },
      {
        $project: { password: 0 },
      },
    ])
    .toArray();
  const insertedUser = insertedUserPayload[0];

  const token = jwt.sign(insertedUser, "supersecretkey");
  const registerResponse: LoginResponse = {
    userData: {
      _id: insertedUser.id,
      name: insertedUser.name,
      email: insertedUser.email,
      profileImageUrl: "",
      role: insertedUser.role,
    },
    token,
  };
  return registerResponse;
}

export async function deleteUser(userId: string) {
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");
  const todosCollection = db.collection("todos");

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (user?.profileImageUrl) {
    const imagePath = path.join(process.cwd(), user.profileImageUrl);
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      throw error;
    }
  }

  await todosCollection.deleteMany({ userId: userId });

  const result = await userCollection.deleteOne({
    _id: new ObjectId(userId),
  });

  return result.deletedCount === 1;
}

export async function setUserRole(userId: string, newRole: Role) {
  console.log("userId: ", userId);
  console.log("newRole: ", newRole);
  const db: Db = await connectToDatabase();
  const userCollection = db.collection("users");

  const result = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole } }
  );

  return result.modifiedCount !== 0;
}
