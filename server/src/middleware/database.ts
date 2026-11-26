import type { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES } from "../utils/constants.js";
import { connectDatabase } from "../utils/database.js";

const requireDatabase = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    next(new Error(ERROR_MESSAGES.ENV_REQUIRED));
    return;
  }

  try {
    await connectDatabase(mongoUri);
    next();
  } catch (error) {
    next(error);
  }
};

export { requireDatabase };
