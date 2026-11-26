import { Router } from "express";

import { createUser, login } from "../controllers/users.js";
import { requireDatabase } from "../middleware/database.js";
import { loginLimiter, registerLimiter } from "../middleware/limiter.js";

const authRouter = Router();

authRouter.post("/signup", registerLimiter, requireDatabase, createUser);
authRouter.post("/signin", loginLimiter, requireDatabase, login);

export { authRouter };
