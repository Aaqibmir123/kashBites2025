import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // Small / Full / 1kg
    price: { type: Number, required: true },
  },
  { _id: false }
);

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

    category: {
      type: String,
      required: true,
    },

    /* 🔥 PRICING LOGIC */
    pricingType: {
      type: String,
      enum: ["single", "size", "quantity"],
      default: "single",
    },

    price: {
      type: Number, // only for single price
    },

    variants: {
      type: [variantSchema], // pizza / biryani
      default: [],
    },

    /* 🔥 FOOD TYPE */
    foodType: {
      type: String,
      enum: ["veg", "nonveg"],
      default: "veg",
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
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // 👈 restaurant model ka naam
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductResturant", productSchema);
