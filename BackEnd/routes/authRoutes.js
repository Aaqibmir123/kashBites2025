import express from "express";
import { loginWithPhone,verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", loginWithPhone);
router.post("/verify-otp", verifyOtp);

export default router;  
