import mongoose from "mongoose";

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
      match: [EMAIL_REGEX, "El correo electrónico no es válido"],
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
      minlength: 2,
      maxlength: 30,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export type { IUser };
export default User;
