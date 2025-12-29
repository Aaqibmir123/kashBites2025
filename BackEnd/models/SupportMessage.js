import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupportConversation",
    required: true,
  },

  senderRole: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: String,
  images: [String],
});


export default mongoose.model("SupportMessage", supportMessageSchema);
