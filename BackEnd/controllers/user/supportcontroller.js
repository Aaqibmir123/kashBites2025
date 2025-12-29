import SupportConversation from "../../models/SupportConversation.js";
import SupportMessage from "../../models/SupportMessage.js";

/* ================= GET OR CREATE CONVERSATION ================= */
export const getUserConversation = async (req, res) => {
  try {
    const userId = req.user._id;

    let conversation = await SupportConversation.findOne({ userId });

    if (!conversation) {
      conversation = await SupportConversation.create({
        userId,
      });
    }

    res.json({
      success: true,
      conversationId: conversation._id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= SEND USER MESSAGE ================= */
export const sendUserMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    console.log("🚀 sendUserMessage called with:", {
      conversationId,
      text,
    });
    console.log("🚀 req.files:", req.files);

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId required",
      });
    }

    const images = req.files
      ? req.files.map(
          (file) => `/uploads/support/${file.filename}`
        )
      : [];

    const message = await SupportMessage.create({
      conversationId,
      senderRole: "user",
      senderId: req.user._id,
      text: text || "",
      images,
    });

    res.json({
      success: true,
      data: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET USER MESSAGES ================= */
export const getUserMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await SupportMessage.find({
      conversationId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
