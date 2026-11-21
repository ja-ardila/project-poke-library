import type { NextFunction, Request, Response } from "express";

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
  let statusCode = err.statusCode ?? 500;
  let message = err.message;

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
    message = "Los datos enviados no son válidos";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = err.keyPattern?.email
      ? "El correo electrónico ya está en uso"
      : "Este Pokémon ya está guardado en tu biblioteca";
  }

  if (statusCode === 500) {
    console.error(err);
    message = "Ha ocurrido un error en el servidor";
  }

  res.status(statusCode).send({ message });
};

export { errorHandler };
