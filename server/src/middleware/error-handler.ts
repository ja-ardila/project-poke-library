import type { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants.js";

type ApiError = Error & {
  code?: number;
  keyPattern?: Record<string, number>;
  statusCode?: number;
};

const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = err.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message;

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.INVALID_USER_DATA;
  }

  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = err.keyPattern?.email
      ? ERROR_MESSAGES.DUPLICATE_EMAIL
      : ERROR_MESSAGES.DUPLICATE_POKEMON;
  }

  if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error(err);
    message = ERROR_MESSAGES.INTERNAL_SERVER;
  }

  res.status(statusCode).send({ message });
};

export { errorHandler };
