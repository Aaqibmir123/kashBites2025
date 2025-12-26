import express from "express";
import { loginWithPhone,verifyOtp,savePushToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", loginWithPhone);
router.post("/verify-otp", verifyOtp);
router.post("/save-push-token", savePushToken);


export default router;  
