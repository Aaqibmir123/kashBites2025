import mongoose from "mongoose";

const supportConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // admin baad me reply karega
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "SupportConversation",
  supportConversationSchema
);
