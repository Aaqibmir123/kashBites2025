import Restaurant from "../models/addResturantModel.js";
import User from "../models/userModel.js"; 

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

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Create Restaurant
    const newRestaurant = new Restaurant({
      name,
      ownerName,
      category,
      phone,
      email,
      address,
    });
    await newRestaurant.save();

    // Create User WITH restaurantId
    const newUser = new User({
      phone,
      role: "restaurant",
      restaurantId: newRestaurant._id,   // ⭐ MOST IMPORTANT
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: newRestaurant,
      user: newUser,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



//Get ALL RESTAURANTS
export const getAllRestaurants = async (req, res) => {
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
    const { id } = req.params;
    const updates = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, data: updatedRestaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Delete RESTAURANT

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
