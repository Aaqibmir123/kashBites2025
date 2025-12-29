import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },

    otp: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin", "restaurant"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔥 Restaurant ID for restaurant users
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },

    pushToken: {
      type: String,
      default: "",
    },

    // ❤️ FAVORITES (CORRECT PLACE)
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
