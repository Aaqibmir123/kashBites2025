import Profile from "../../models/Profile.js";
import User from "../../models/userModel.js";

export const updateAdminProfile = async (req, res) => {
  try {
    const { userId, name,email } = req.body;

    let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      if (imagePath) profile.image = imagePath;
      await profile.save();
    } else {
      profile = await Profile.create({
        user: userId,
        name,
        email,
        
        image: imagePath
      });
    }

    res.json({ message: "Profile saved", profile });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAdminProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const user = await User.findById(userId).select("-otp");
    console.log(user,'user')
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ user: userId });

    const merged = {
      _id: user._id,
      phone: user.phone || "",
      email: profile.email || "",
      name: profile?.name || "",
      image: profile?.image || ""
    };

    return res.json(merged);
  } catch (err) {
    console.log("GET PROFILE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};
