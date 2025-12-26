import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: String,
  phone: String,

  house: String, // house + landmark
  village: String, // area / village

  pincode: String,
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
