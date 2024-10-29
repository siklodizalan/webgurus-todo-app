import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/models/User";

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
            res.status(401).json({ message: "Failed to authenticate token" }),
        );
        }
        res.locals.userId = verifyToken(authHeader);
        return next();
    } catch (err) {
        return next(
        res.status(401).json({ message: "Failed to authenticate token" }),
        );
    }
};
