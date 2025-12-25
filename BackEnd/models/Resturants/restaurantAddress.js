import mongoose from "mongoose";

const restaurantAddressSchema = new mongoose.Schema(
  {
    // 🔥 Parent Restaurant ID
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },

    location: {
      latitude: {
        type: String,
        default: "",
      },
      longitude: {
        type: String,
        default: "",
      },
    },

    fssaiNumber: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    // OPTIONAL (future use)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "AddRestaurantAddress",
  restaurantAddressSchema
);
