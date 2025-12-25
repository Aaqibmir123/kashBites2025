import express from "express";
import upload from "../../middleware/upload.js"; // ✅ default import
import {updateAdminProfile,getAdminProfile} from "../../controllers/admin/adminProfileController.js"

const router = express.Router();

router.post("/update-Admin-Profile", upload.single("image"), updateAdminProfile);
router.post("/getAdminprofile", getAdminProfile);

export default router;
