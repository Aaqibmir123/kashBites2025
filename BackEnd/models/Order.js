import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },

      house: { type: String, required: true },    // line1
      village: { type: String, required: true },  // area
      pincode: { type: String },                   // optional
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        qty: Number,
        image: String,
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
          required: true,
        },
      },
    ],

    // 🔥 single-restaurant assumption
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    itemTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Ready", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
