import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
     processId: String,
      name: String,
      price: Number,
      image: String,
      qty: { type: Number, default: 1, min: 1 },
      size:String,
      productId:String,
      restaurantId:String
    }
  ]

}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
