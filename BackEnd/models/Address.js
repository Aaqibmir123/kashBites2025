import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  phone: String,
  email: String,
  house: String,
  village: String,
  city: String,
  state: String,
  pincode: String
});

const Address = mongoose.model("Address", addressSchema);
export default Address

