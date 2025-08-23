import express from "express";
import { validate } from "../middlewares/validate";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validation/authValidation";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authController";
import { upload } from "../middlewares/multer";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validate(registerSchema),
  register
);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
