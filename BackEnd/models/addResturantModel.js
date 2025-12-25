import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    // ✅ IMAGE FIELD (NEW)
    image: {
      type: String, // stores path like /uploads/xxxx.jpg
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },

    openTime: {
      type: String, // "10:00"
      default: "10:00",
    },

    closeTime: {
      type: String, // "23:00"
      default: "22:00",
    },

    pauseUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
