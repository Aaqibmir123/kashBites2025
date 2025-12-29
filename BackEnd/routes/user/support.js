import express from "express";
import {
  getUserConversation,
  sendUserMessage,
  getUserMessages,
} from "../../controllers/user/supportController.js";

import uploadSupport from "../../middleware/uploadSupport.js"; // 👈 chat multer

const router = express.Router();
router.get("/conversation", getUserConversation);
router.post(
  "/message",
  uploadSupport.array("images", 5), 
  sendUserMessage
);
router.get("/messages/:conversationId", getUserMessages);

export default router;
