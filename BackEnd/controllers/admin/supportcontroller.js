import Message from "../../models/SupportMessage.js";
import SupportConversation from "../../models/SupportConversation.js";

export const getAdminConversations = async (req, res) => {
  try {
    const conversations = await SupportConversation.find()
      .populate("userId", "phone role") // 👈 USER DATA
      .sort({ updatedAt: -1 });

    const data = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne(
          { conversationId: conv._id },
          {},
          { sort: { createdAt: -1 } }
        );

        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          senderRole: "user",
          read: false,
        });

        return {
          _id: conv._id,
          user: conv.userId,              // 👈 USER OBJECT
          lastMessage: lastMsg?.text || "",
          lastMessageTime: lastMsg?.createdAt || conv.updatedAt,
          unreadCount,
        };
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("ADMIN CONVERSATION ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ================= CHAT ================= */
export const getAdminMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

  res.json({ success: true, data: messages });
};

/* ================= SEND ================= */
export const sendAdminMessage = async (req, res) => {
      console.log("REQ.USER 👉", req.user); // 🔥 DEBUG

  try {
    const { conversationId, text } = req.body;

    if (!conversationId) {
      return res
        .status(400)
        .json({ success: false, message: "conversationId required" });
    }

    // 🔥 IMPORTANT: req.user se admin id nikaalo
    const adminId = req.user._id; // 👈 TOKEN SE

    if (!adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const images = req.files
      ? req.files.map((f) => `/uploads/support/${f.filename}`)
      : [];

    const message = await Message.create({
      conversationId,
      senderRole: "admin",   // ✅ REQUIRED
      senderId: adminId,     // ✅ REQUIRED (FIX)
      text: text || "",
      images,
    });

    // optional: conversation update
    await SupportConversation.findByIdAndUpdate(conversationId, {
      adminId,
      updatedAt: new Date(),
    });

    return res.json({
      success: true,
      data: message,
    });
  } catch (err) {
    console.error("SEND ADMIN MESSAGE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/* ================= MARK READ ================= */
export const markConversationRead = async (req, res) => {
  const { conversationId } = req.params;

  await Message.updateMany(
    { conversationId, senderRole: "user", read: false },
    { read: true }
  );

  res.json({ success: true });
};
