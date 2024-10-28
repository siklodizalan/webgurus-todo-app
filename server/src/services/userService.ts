import jwt from 'jsonwebtoken';
import { connectToDatabase } from "../database/connection.js";
import bcrypt from "bcryptjs";
import { Db, ObjectId } from 'mongodb';
import { validateUser } from "../utils/validationUtil";
import { LoginResponse, User } from '../database/models/User.js';
import { PORT } from '../index.js';

export async function uniqueUser(username: string, email: string) {
    const db: Db = await connectToDatabase();
    const userCollection = db.collection("users");
    const existingUser = await userCollection.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        throw new Error("An account with this username or email already exists.");
    }
    return true;
}

export async function profile(userId: string) {
    const db: Db = await connectToDatabase();
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (user === null) {
        throw new Error("No such user!");
    }

    const token = jwt.sign(user, 'supersecretkey');
    const profileResponse: LoginResponse = {userData: {
        _id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: `http://localhost:${PORT}${user.profileImageUrl}`,
    },
    token};

    return profileResponse;
}

export async function saveProfileImageToUser(userId: string, imageUrl: string) {
    const db: Db = await connectToDatabase();
    const userCollection = db.collection("users");

    await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { profileImageUrl: imageUrl } }
    );
}

export async function login(name: string, password: string) {
    const db: Db = await connectToDatabase();
    const userCollection = db.collection("users");
    const user = await userCollection
        .findOne({ name });
    if (user === null) {
        throw new Error("No such user!");
    }
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        throw new Error("Invalid password!");
    }
    const token = jwt.sign(user, 'supersecretkey');
    const loginResponse: LoginResponse = {userData: {
        _id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: `http://localhost:${PORT}${user.profileImageUrl}`,
    },
    token};
    return loginResponse;
}

export async function register(name: string, email: string, password: string, confirmPassword: string) {
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

    const newUser = { name, email, password};

    const result = await userCollection.insertOne(newUser);
    const insertedUserPayload = await userCollection.aggregate([
        {
            $match: { _id: new ObjectId(result.insertedId) }
        },
        { 
            $project: { "password": 0 } 
        }]).toArray();
    const insertedUser = insertedUserPayload[0];

    const token = jwt.sign(insertedUser, 'supersecretkey');
    const registerResponse: LoginResponse = {userData: {
        _id: insertedUser.id,
        name: insertedUser.name,
        email: insertedUser.email,
        profileImageUrl: '',
    },
    token};
    return registerResponse;
}