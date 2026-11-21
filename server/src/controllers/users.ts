import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { HttpError } from "../utils/errors.js";
import { EMAIL_REGEX } from "../utils/validation.js";

type UserDocument = {
  _id: unknown;
  email: string;
  name: string;
};

const getSafeUserData = (user: UserDocument) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
});

const getCurrentUserId = (req: Request): string => {
  const userId = req.user?._id;

  if (!userId) {
    throw new HttpError(401, "Se requiere autorización");
  }

  return userId;
};

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(getCurrentUserId(req));

  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.status(200).json(getSafeUserData(user));
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    !email.trim() ||
    !password ||
    !name.trim()
  ) {
    throw new HttpError(
      400,
      "El correo electrónico, la contraseña y el nombre son obligatorios",
    );
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    throw new HttpError(400, "El correo electrónico no es válido");
  }

  if (password.length < 8 || password.length > 72) {
    throw new HttpError(
      400,
      "La contraseña debe tener entre 8 y 72 caracteres",
    );
  }

  if (name.trim().length < 2 || name.trim().length > 30) {
    throw new HttpError(400, "El nombre debe tener entre 2 y 30 caracteres");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
  });

  res.status(201).json(getSafeUserData(user));
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new HttpError(
      400,
      "El correo electrónico y la contraseña son obligatorios",
    );
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new HttpError(401, "Correo o contraseña incorrectos");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Correo o contraseña incorrectos");
  }

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  res.status(200).json({
    token,
    user: getSafeUserData(user),
  });
};

export { createUser, getCurrentUser, login };
