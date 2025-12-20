import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    address: {
      name: String,
      phone: String,
      email: String,
      address: String,
      village: String,
      city: String,
      pincode: String,
    },

    product: {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      description: String,
      price: Number,
      qty: Number,
      image: String,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
