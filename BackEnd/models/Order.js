const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },

  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: Number,
    price: Number
  }],

  totalAmount: Number,
  paymentStatus: { type: String, default: "PENDING" },
  orderStatus: { type: String, default: "PLACED" },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
