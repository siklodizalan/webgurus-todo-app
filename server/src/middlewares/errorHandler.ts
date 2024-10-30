import { Request, Response, NextFunction, } from "express";
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: ERROR_MESSAGES.unexpected });
    }
};