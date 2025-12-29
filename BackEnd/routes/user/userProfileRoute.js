import express from "express";
import upload from "../../middleware/upload.js"; // 👈 multer
import {
  getUserProfile,
  updateUserProfile,
} from "../../controllers/user/userProfileController.js";

const router = express.Router();

router.get("/", getUserProfile);

// ✅ VERY IMPORTANT
router.put("/", upload.single("image"), updateUserProfile);

export default router;
