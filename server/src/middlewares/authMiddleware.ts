import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/models/User";
import { Db, ObjectId } from "mongodb";
import { connectToDatabase } from "../database/connection";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export function verifyToken(authHeader: string) {
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(token, "supersecretkey") as User;
  return decoded._id as string;
}

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
          return next(
              res.status(401).json({ message: ERROR_MESSAGES.failedTokenAuthentication }),
          );
        }
        res.locals.userId = verifyToken(authHeader);
        return next();
    } catch (err) {
        return next(
          res.status(401).json({ message: ERROR_MESSAGES.failedTokenAuthentication }),
        );
    }
};

export const checkAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const db: Db = await connectToDatabase();
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      res.status(404).json({ message: ERROR_MESSAGES.userNotFound });
      return;
    }

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: ERROR_MESSAGES.adminsOnly });
      return;
    }

    next();
  } catch (err) {
    console.error("Error checking admin role: ", err);
    res.status(500).json({ message: ERROR_MESSAGES.internal });
  }
};
