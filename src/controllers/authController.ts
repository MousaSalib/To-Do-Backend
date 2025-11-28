import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendEmail } from "../utils/sendEmail";
import { otpTemplate } from "../templates/otpTemplate";
import { uploadImageBuffer } from "../lib/cloudinary";
import { otpPasswordTemplate } from "../templates/otpPasswordTemplate";
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists, You have to login" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  let profileImage = null;
  let profileImagePublicId = null;

  if (req.file) {
    const uploadResult = await uploadImageBuffer(req.file.buffer);
    profileImage = uploadResult.url;
    profileImagePublicId = uploadResult.publicId;
  } else {
    profileImage = "https://www.w3schools.com/howto/img_avatar.png";
  }

  await User.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpires,
    profileImage,
    profileImagePublicId,
  });

  await sendEmail(email, "Verify your email", otpTemplate(otp));

  res.status(201).json({
    message: "User registered successfully. Please verify your email.",
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpires ||
    user.otpExpires < new Date()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      profileImage: user.profileImage,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail(
    email,
    "Reset Your Password",
    resetPasswordTemplate(resetLink)
  );

  res.json({
    message: "Password reset link sent to your email",
    resetLink,
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;

  await user.save();

  await sendEmail(email, "Verify your email", otpTemplate(otp));

  res.json({ message: "New OTP sent successfully" });
};
