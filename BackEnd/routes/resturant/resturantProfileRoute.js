import express from "express";
import upload from "../../middleware/upload.js";
import {
  getResturantProfile,
  updateResturantProfile,
} from "../../controllers/ResturantsController/resturantProfileController.js";

const router = express.Router();

/* 🧪 TEST ROUTE (CONFIRM HIT) */
router.get("/", (req, res, next) => {
  console.log("✅ RESTAURANT PROFILE ROUTE HIT");
  console.log("REQ.USER:", req.user); // authMiddleware check
  next(); // 🔥 VERY IMPORTANT
});

/* ✅ GET PROFILE */
router.get("/", getResturantProfile);

/* ✅ UPDATE PROFILE */
router.put("/", upload.single("image"), updateResturantProfile);

export default router;
