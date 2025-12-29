import User from "../../models/userModel.js";

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;        // token se
    const { productId } = req.body;     // frontend se

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const isAlreadyFav = user.favorites.includes(productId);

    if (isAlreadyFav) {
      // ❌ remove
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== productId
      );
    } else {
      // ✅ add
      user.favorites.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("favorites");

    res.json({
      success: true,
      favorites: user.favorites, // array of productIds
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

