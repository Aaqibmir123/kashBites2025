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
      type: String,        // stores path like /uploads/xxxx.jpg
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
