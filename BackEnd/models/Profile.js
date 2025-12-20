import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  name: String,
  email: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
