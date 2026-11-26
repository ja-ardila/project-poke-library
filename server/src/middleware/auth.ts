import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants.js";
import { HttpError } from "../utils/errors.js";

const isUserPayload = (
  payload: string | JwtPayload,
): payload is JwtPayload & { _id: string } =>
  typeof payload !== "string" && typeof payload._id === "string";

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.match(/^Bearer (\S+)$/);

  if (!bearerToken?.[1]) {
    next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTH_TOKEN_REQUIRED,
      ),
    );
    return;
  }

  try {
    const payload = jwt.verify(bearerToken[1], process.env.JWT_SECRET!);

    if (!isUserPayload(payload)) {
      next(
        new HttpError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN),
      );
      return;
    }

    req.user = { _id: payload._id };
    next();
  } catch {
    next(
      new HttpError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN),
    );
  }
};

export { auth };
