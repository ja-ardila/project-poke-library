import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { HttpError } from "../utils/errors.js";

const isUserPayload = (
  payload: string | JwtPayload,
): payload is JwtPayload & { _id: string } =>
  typeof payload !== "string" && typeof payload._id === "string";

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.match(/^Bearer (\S+)$/);

  if (!bearerToken?.[1]) {
    next(new HttpError(401, "Se requiere un token de autorización"));
    return;
  }

  try {
    const payload = jwt.verify(bearerToken[1], process.env.JWT_SECRET!);

    if (!isUserPayload(payload)) {
      next(new HttpError(401, "Token inválido o expirado"));
      return;
    }

    req.user = { _id: payload._id };
    next();
  } catch {
    next(new HttpError(401, "Token inválido o expirado"));
  }
};

export { auth };
