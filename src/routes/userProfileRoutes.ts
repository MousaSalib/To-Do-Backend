import express from "express";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/authMiddleware";
import {
  changePasswordSchema,
  updateUserEmailSchema,
  updateUserProfileSchema,
  verifyUpdatedEmailSchema,
} from "../validation/userProfileValidation";
import {
  changePassword,
  deleteUserProfile,
  getUserProfile,
  updateUserEmail,
  updateUserProfile,
  updateUserProfileImage,
  verifyUpdatedEmail,
} from "../controllers/userProfileController";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.use(protect);

router.put(
  "/update-profile",
  validate(updateUserProfileSchema),
  updateUserProfile
);
router.put(
  "/update-profile-image",
  upload.single("profileImage"),
  updateUserProfileImage
);
router.put(
  "/update-profile-email",
  validate(updateUserEmailSchema),
  updateUserEmail
);
router.put(
  "/verify-updated-email",
  validate(verifyUpdatedEmailSchema),
  verifyUpdatedEmail
);
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePassword
);
router.get("/", getUserProfile);
router.delete("/delete-account", deleteUserProfile);

export default router;
