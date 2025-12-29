import Profile from "../../models/Profile.js";
import User from "../../models/userModel.js";

export const updateResturantProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const { name, email } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      if (name) profile.name = name;
      if (email) profile.email = email;
      if (imagePath) profile.image = imagePath;
      await profile.save();
    } else {
      profile = await Profile.create({
        user: userId,
        name: name || "",
        email: email || "",
        image: imagePath || "",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getResturantProfile = async (req, res) => {
  try {
    // ✅ userId token se
    const userId = req.user.userId || req.user._id;

    const user = await User.findById(userId).select("-otp -__v");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findOne({ user: userId });

    const mergedProfile = {
      _id: user._id,
      phone: user.phone || "",
      email: profile?.email || "",
      name: profile?.name || "",
      image: profile?.image || "",
      role: user.role,
    };

    return res.json({
      success: true,
      data: mergedProfile,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
