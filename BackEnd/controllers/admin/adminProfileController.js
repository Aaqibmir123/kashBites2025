import Profile from "../../models/Profile.js";
import User from "../../models/userModel.js";

export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.userId || req.user._id; // ✅ JWT

    const { name, email } = req.body || {};

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let profile = await Profile.findOne({ user: adminId });

    if (profile) {
      if (name) profile.name = name;
      if (email) profile.email = email;
      if (imagePath) profile.image = imagePath;
      await profile.save();
    } else {
      profile = await Profile.create({
        user: adminId,
        name,
        email,
        image: imagePath,
      });
    }

    res.json({
      success: true,
      message: "Admin profile updated",
      data: profile,
    });
  } catch (err) {
    console.error("UPDATE ADMIN PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.userId || req.user._id; // 🔥 FIX

    const user = await User.findById(adminId).select("-otp");
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const profile = await Profile.findOne({ user: adminId });

    return res.json({
      success: true,
      data: {
        _id: user._id,
        phone: user.phone || "",
        email: profile?.email || "",
        name: profile?.name || "",
        image: profile?.image || "",
        role: user.role,
      },
    });
  } catch (err) {
    console.error("GET ADMIN PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
