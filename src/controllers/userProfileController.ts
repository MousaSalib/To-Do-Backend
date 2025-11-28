import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { uploadImageBuffer } from "../lib/cloudinary";
import { sendEmail } from "../utils/sendEmail";
import { otpUpdateEmailTemplate } from "../templates/otpUpdateEmailTemplate";

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userId !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    user.name = name || user.name;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateUserProfileImage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userId !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    const result = await uploadImageBuffer(file.buffer);

    user.profileImage = result.url;
    user.profileImagePublicId = result.publicId;

    await user.save();

    res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateUserEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { email } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    (user as any).pendingEmail = email;
    await user.save();

    await sendEmail(
      email,
      "Verify your new email",
      otpUpdateEmailTemplate(otp)
    );

    res.json({
      message:
        "Verification OTP sent to your new email. Please verify to update.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const verifyUpdatedEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { otp } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if ((user as any).pendingEmail) {
      user.email = (user as any).pendingEmail;
      (user as any).pendingEmail = undefined;
    }

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Email updated successfully", email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (userId !== user._id.toString() && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only delete your own profile" });
    }

    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
