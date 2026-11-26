import mongoose from "mongoose";

import { ERROR_MESSAGES, USER_LIMITS } from "../utils/constants.js";
import { EMAIL_REGEX } from "../utils/validation.js";

interface IUser {
  email: string;
  password: string;
  name: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, ERROR_MESSAGES.INVALID_EMAIL],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: USER_LIMITS.NAME_MIN_LENGTH,
      maxlength: USER_LIMITS.NAME_MAX_LENGTH,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export type { IUser };
export default User;
