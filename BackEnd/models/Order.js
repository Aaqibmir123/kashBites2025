import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      name: String,
      phone: String,
      address: String,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        qty: Number,
        image: String,
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
      },
    ],

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    itemTotal: Number,
    deliveryFee: Number,
    platformFee: Number,
    gst: Number,
    totalAmount: Number,
    paymentMethod: String,

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Ready", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


export default mongoose.model("Order", orderSchema);
