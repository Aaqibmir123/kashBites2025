import express from "express";
import {
  getAdminConversations,
  getAdminMessages,
  sendAdminMessage,
  markConversationRead,
} from "../../controllers/admin/supportcontroller.js";

import upload from "../../middleware/uploadSupport.js";

const router = express.Router();

router.get("/conversations", getAdminConversations); // 👈 LIST
router.get("/messages/:conversationId", getAdminMessages); // 👈 CHAT
router.post("/send-message", upload.array("images", 5), sendAdminMessage);
router.patch("/mark-read/:conversationId", markConversationRead);

export default router;
