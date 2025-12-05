import express from "express";
import upload from "../middleware/upload.js"; // ✅ default import
import {
  updateProfile,
  getProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/update", upload.single("image"), updateProfile);
router.post("/get-profile", getProfile);

export default router;
