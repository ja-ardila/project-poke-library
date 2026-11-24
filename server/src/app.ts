import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import type { CorsOptions } from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";

import { createUser, login } from "./controllers/users.js";
import { auth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import {
  apiLimiter,
  loginLimiter,
  registerLimiter,
} from "./middleware/limiter.js";
import router from "./routes/index.js";
import {
  ERROR_MESSAGES,
  HEALTH_STATUS,
  HTTP_STATUS,
  REQUEST_BODY_LIMIT,
} from "./utils/constants.js";
import { connectDatabase } from "./utils/database.js";
import { HttpError } from "./utils/errors.js";

const app = express();
const port = Number(process.env.PORT);
const mongoUri = process.env.MONGO_URI;
const clientOrigin = process.env.CLIENT_ORIGIN;

if (
  !process.env.JWT_SECRET ||
  !mongoUri ||
  !clientOrigin ||
  !Number.isInteger(port) ||
  port <= 0
) {
  throw new Error(ERROR_MESSAGES.ENV_REQUIRED);
}

const allowedOrigins = new Set(
  clientOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(
      new HttpError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.CORS_FORBIDDEN),
    );
  },
};

const requireDatabase = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await connectDatabase(mongoUri);
    next();
  } catch (error) {
    next(error);
  }
};

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: HEALTH_STATUS });
});

app.post("/signup", registerLimiter, requireDatabase, createUser);
app.post("/signin", loginLimiter, requireDatabase, login);

app.use(auth);
app.use(requireDatabase);
app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  process.stdout.write(`Servidor ejecutándose en http://localhost:${port}\n`);
});
