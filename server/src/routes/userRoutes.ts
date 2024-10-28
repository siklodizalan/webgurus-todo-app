import express from "express";
import { Request, Response, NextFunction } from 'express';
import { Db, ObjectId } from "mongodb";
import { login, profile, register, saveProfileImageToUser } from "../services/userService";
import { connectToDatabase } from "../database/connection";
import { verifyToken } from "../middlewares/authMiddleware";
import multer from "multer";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(500).json({ message: 'An unexpected error occurred' });
            return;
        }

        const userId = verifyToken(authHeader);
        if (!userId) {
            res.status(500).json({ message: 'An unexpected error occurred' });
            return;
        }

        const profileResponse = await profile(userId);
        
        res.status(200).json(profileResponse);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const loginResponse = await login(req.body.name, req.body.password);
        res.status(200).json(loginResponse);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});

router.post("/register", async (req, res) => {
    try {
        const registerResponse = await register(req.body.name, req.body.email, req.body.password, req.body.confirmPassword);
        res.status(201).json(registerResponse);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});

router.post("/file-upload", upload.single('profileImage'), async (req, res): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded!"});
        return;
    }

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(500).json({ message: 'An unexpected error occurred' });
            return;
        }

        const userId = verifyToken(authHeader);
        if (!userId) {
            res.status(500).json({ message: 'An unexpected error occurred' });
            return;
        }
        
        const imageUrl = `/uploads/${req.file!.filename}`;
        await saveProfileImageToUser(userId, imageUrl);
        res.status(200).json({ imageUrl });
    } catch (err) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});

router.use('/uploads', express.static(UPLOAD_DIR));

router.delete("/users/:id", async (req, res) => {
    try {
        const db: Db = await connectToDatabase();
        const userCollection = db.collection("users");
        const userId = req.params.id;

        const result = await userCollection.deleteOne({
            _id: new ObjectId(userId),
        });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});

export default router;
