const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  method: String,
  transactionId: String,
  amount: Number,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
