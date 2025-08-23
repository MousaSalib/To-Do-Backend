import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(3),
});

export const updateUserEmailSchema = z.object({
  email: z.string().email(),
});

export const verifyUpdatedEmailSchema = z.object({
  otp: z.string().length(6),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
