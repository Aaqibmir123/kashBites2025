import Restaurant from "../../models/addResturantModel.js";
import User from "../../models/userModel.js";
import addProducts from "../../models/resturants/addProducts.js";

// CREATE RESTAURANT
export const createRestaurant = async (req, res) => {
  try {
    const { name, ownerName, phone, email, address, category } = req.body;

    if (!name || !ownerName || !phone || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ❗ phone unique check
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // IMAGE
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // ✅ CREATE RESTAURANT (WITH DEFAULT TIMING)
    const newRestaurant = new Restaurant({
      name,
      ownerName,
      phone,
      email,
      address,
      category,
      image: imagePath,

      // 🔥 DEFAULT SETTINGS
      isOpen: true,
      openTime: "09:00",
      closeTime: "22:00",
      pauseUntil: null,
    });

    await newRestaurant.save();

    // ✅ CREATE USER
    const newUser = new User({
      phone,
      role: "restaurant",
      restaurantId: newRestaurant._id,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: newRestaurant,
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Get ALL RESTAURANTS
export const getAllRestaurants = async (req, res) => {
  console.log('GET ALL RESTAURANTS CALLED Admin');
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//UPDATE RESTAURANT
export const updateRestaurant = async (req, res) => {
  try {
    const id = req.params.restaurantId;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    // ===== TEXT FIELDS =====
    restaurant.name = req.body.name ?? restaurant.name;
    restaurant.ownerName = req.body.ownerName ?? restaurant.ownerName;
    restaurant.phone = req.body.phone ?? restaurant.phone;
    restaurant.email = req.body.email ?? restaurant.email;
    restaurant.address = req.body.address ?? restaurant.address;
    restaurant.category = req.body.category ?? restaurant.category;

    // ===== IMAGE (ONLY IF UPLOADED) =====
    if (req.file) {
      restaurant.image = `/uploads/${req.file.filename}`;
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.error("UPDATE RESTAURANT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const id = req.params.restaurantId;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // 2️⃣ Delete all products of this restaurant
    await addProducts.deleteMany({ restaurantId: id });

    res.status(200).json({
      success: true,
      message: "Restaurant and its products deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
