import AddRestaurantAddress from "../../models/resturants/restaurantAddress.js";


export const createOrUpdateRestaurantAddress = async (req, res) => {
  try {
    const {
      updateId, // 🔥 OPTIONAL (agar aaya → update)
      restaurantId,
      restaurantName,
      ownerName,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      fssaiNumber,
      gstNumber,
    } = req.body;

    if (
      !restaurantId ||
      !restaurantName ||
      !ownerName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let result;

    // ======================
    // 🔁 UPDATE
    // ======================
    if (updateId) {
      result = await AddRestaurantAddress.findByIdAndUpdate(
        updateId,
        {
          restaurantId,
          restaurantName,
          ownerName,
          phone,
          address,
          city,
          state,
          pincode,
          location: {
            latitude,
            longitude,
          },
          fssaiNumber,
          gstNumber,
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Restaurant address not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Restaurant address updated successfully",
        data: result,
      });
    }

    // ======================
    // ➕ CREATE
    // ======================
    result = await AddRestaurantAddress.create({
      restaurantId,
      restaurantName,
      ownerName,
      phone,
      address,
      city,
      state,
      pincode,
      location: {
        latitude,
        longitude,
      },
      fssaiNumber,
      gstNumber,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant address created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create / Update Address Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await AddRestaurantAddress.findOne({ restaurantId });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

