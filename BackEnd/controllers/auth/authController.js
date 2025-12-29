import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";


export const loginWithPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: "Phone number required" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ ADMIN NUMBER SET
    const ADMIN_NUMBER = "9596523404";

    let user = await User.findOne({ phone });

    // ✅ Role decide based on phone
    let role = phone === ADMIN_NUMBER ? "admin" : "user";

    if (!user) {
      user = await User.create({
        phone,
        otp,
        role,
      });
    } else {
      user.otp = otp;

      // ✅ Agar admin number se login ho raha hai to role update karo
      if (phone === ADMIN_NUMBER) {
        user.role = "admin";
      }

      await user.save();
    }

    console.log("Generated OTP ==> ", otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
      otp, // dev only
      userId: user._id,
     
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Clear OTP
    user.otp = null;
    await user.save();

    // ✅ Generate token with ROLE included
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        role: user.role, // ✅ ADD ROLE
         restaurantId: user.restaurantId
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send role back to frontend
    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId, // ⭐ SEND restaurantId
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const savePushToken = async (req, res) => {
  try {
    const { userId, pushToken } = req.body;

    if (!userId || !pushToken) {
      return res
        .status(400)
        .json({ success: false, message: "userId or pushToken missing" });
    }

    await User.findByIdAndUpdate(userId, { pushToken });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

