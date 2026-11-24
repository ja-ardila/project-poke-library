import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import {
  BCRYPT_SALT_ROUNDS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  JWT_EXPIRES_IN,
  USER_LIMITS,
} from "../utils/constants.js";
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
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.AUTH_REQUIRED);
  }

  return userId;
};

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(getCurrentUserId(req));

  if (!user) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  res.status(HTTP_STATUS.OK).json(getSafeUserData(user));
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
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.USER_FIELDS_REQUIRED,
    );
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (
    password.length < USER_LIMITS.PASSWORD_MIN_LENGTH ||
    password.length > USER_LIMITS.PASSWORD_MAX_LENGTH
  ) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_PASSWORD_LENGTH,
    );
  }

  if (
    name.trim().length < USER_LIMITS.NAME_MIN_LENGTH ||
    name.trim().length > USER_LIMITS.NAME_MAX_LENGTH
  ) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_NAME_LENGTH,
    );
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await User.create({
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
  });

  res.status(HTTP_STATUS.CREATED).json(getSafeUserData(user));
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
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.LOGIN_FIELDS_REQUIRED,
    );
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new HttpError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.LOGIN_UNAUTHORIZED,
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.LOGIN_UNAUTHORIZED,
    );
  }

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: JWT_EXPIRES_IN },
  );

  res.status(HTTP_STATUS.OK).json({
    token,
    user: getSafeUserData(user),
  });
};

export { createUser, getCurrentUser, login };
