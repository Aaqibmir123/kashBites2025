import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    veg: {
      type: Boolean,
      default: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
    },
    restaurantId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ProductResturant", productSchema);
