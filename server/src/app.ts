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
  throw new Error(
    "JWT_SECRET, MONGO_URI, PORT y CLIENT_ORIGIN deben estar configuradas",
  );
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

    callback(new HttpError(403, "El origen de la solicitud no está permitido"));
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
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
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
