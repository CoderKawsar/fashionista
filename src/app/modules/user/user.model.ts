import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    full_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile_number: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
