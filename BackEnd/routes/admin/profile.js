import express from "express";
import upload from "../../middleware/upload.js";
import {
  updateAdminProfile,
  getAdminProfile,
} from "../../controllers/admin/adminProfileController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("✅ ADMIN PROFILE ROUTE HIT");
  next();
});

router.get("/", getAdminProfile);
router.put("/", upload.single("image"), updateAdminProfile);

export default router;
