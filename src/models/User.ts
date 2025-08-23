import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  pendingEmail?: string;
  profileImage?: string;
  profileImagePublicId?: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    pendingEmail: { type: String, default: null },
    profileImage: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImagePublicId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
