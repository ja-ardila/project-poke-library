import { rateLimit } from "express-rate-limit";

import {
  ERROR_MESSAGES,
  RATE_LIMIT_CONFIG,
} from "../utils/constants.js";

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.API.WINDOW_MS,
  limit: RATE_LIMIT_CONFIG.API.LIMIT,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: ERROR_MESSAGES.API_RATE_LIMIT,
  },
});

const loginLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.LOGIN.WINDOW_MS,
  limit: RATE_LIMIT_CONFIG.LOGIN.LIMIT,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: ERROR_MESSAGES.LOGIN_RATE_LIMIT,
  },
});

const registerLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.REGISTER.WINDOW_MS,
  limit: RATE_LIMIT_CONFIG.REGISTER.LIMIT,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: ERROR_MESSAGES.REGISTER_RATE_LIMIT,
  },
});

export { apiLimiter, loginLimiter, registerLimiter };
