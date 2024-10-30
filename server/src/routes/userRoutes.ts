import express from "express";
import { Request, Response, NextFunction } from "express";
import {
  deleteUser,
  getAllUsers,
  login,
  profile,
  register,
  saveProfileImageToUser,
  setUserRole,
} from "../services/userService";
import { checkAdmin, verifyToken } from "../middlewares/authMiddleware";
import multer from "multer";
import path from "path";
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.status(500).json({ message: ERROR_MESSAGES.unexpected });
        return;
      }

      const userId = verifyToken(authHeader);
      if (!userId) {
        res.status(500).json({ message: ERROR_MESSAGES.unexpected });
        return;
      }

      const profileResponse = await profile(userId);

      res.status(200).json(profileResponse);
    } catch (err) {
      next(err);
    }
  },
);

router.get("/users", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next) => {
  try {
    const loginResponse = await login(req.body.name, req.body.password);
    res.status(200).json(loginResponse);
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const registerResponse = await register(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.confirmPassword,
      req.body.role,
    );
    res.status(201).json(registerResponse);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/file-upload",
  upload.single("profileImage"),
  async (req, res, next): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: ERROR_MESSAGES.noFileUploaded });
      return;
    }

    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.status(500).json({ message: ERROR_MESSAGES.unexpected });
        return;
      }

      const userId = verifyToken(authHeader);
      if (!userId) {
        res.status(500).json({ message: ERROR_MESSAGES.unexpected });
        return;
      }

      const imageUrl = `/uploads/${req.file!.filename}`;
      await saveProfileImageToUser(userId, imageUrl);
      res.status(200).json({ imageUrl });
    } catch (err) {
      next(err);
    }
  },
);

router.use("/uploads", express.static(UPLOAD_DIR));

router.delete("/user", async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(500).json({ message: ERROR_MESSAGES.unexpected });
      return;
    }

    const userId = verifyToken(authHeader);
    if (!userId) {
      res.status(500).json({ message: ERROR_MESSAGES.unexpected });
      return;
    }
    
    const deleteSuccessful = await deleteUser(userId);
    if (deleteSuccessful) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: ERROR_MESSAGES.userNotFound });
    }
  } catch (err) {
    next(err)
  }
});

router.delete("/users/:id", checkAdmin, async (req, res, next) => {
  try {
    const deleteSuccessful = await deleteUser(req.params.id);
    if (deleteSuccessful) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: ERROR_MESSAGES.userNotFound });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/users/role", checkAdmin, async (req, res, next) => {
  try {
    const { userId, newRole} = req.body;
    console.log("userId: ", userId);
    console.log("newRole: ", newRole);

    const updateSuccessful = await setUserRole(userId, newRole);
    if (updateSuccessful) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: ERROR_MESSAGES.errorSettingUserRole});
    }
  } catch (err) {
    next(err);
  }
});

export default router;
