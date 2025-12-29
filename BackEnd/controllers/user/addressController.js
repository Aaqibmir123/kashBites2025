import Address from  "../../models/Address.js";
import Order from "../../models/Order.js";

export const addAddress = async (req, res) => {
  try {
    const {
      userId,
      name,
      phone,
      house,
      village,
      pincode,
      email,
      city,
      state,
    } = req.body;

    // ✅ REQUIRED FIELD VALIDATION
    if (!userId || !name || !phone || !house || !village) {
      return res.status(400).json({
        success: false,
        message: "Missing required address fields",
      });
    }

    // ✅ CHECK EXISTING ADDRESS
    let address = await Address.findOne({ userId });

    if (address) {
      // 🔁 UPDATE EXISTING
      address.name = name;
      address.phone = phone;
      address.house = house;
      address.village = village;
      address.pincode = pincode || address.pincode;
      address.email = email || address.email;
      address.city = city || address.city;
      address.state = state || address.state;

      await address.save();

      return res.status(200).json({
        success: true,
        message: "Address updated successfully",
        address,
      });
    }

    // ➕ CREATE NEW ADDRESS
    const newAddress = await Address.create({
      userId,
      name,
      phone,
      house,
      village,
      pincode,
      email,
      city,
      state,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getLastOrderAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("Fetching last order address for user:", userId);

    const lastOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 })   // 🔥 latest order
      .select("address");        // 🔥 only address

    if (!lastOrder) {
      return res.status(200).json({
        success: true,
        address: null,
      });
    }

    return res.status(200).json({
      success: true,
      address: lastOrder.address,
    });
  } catch (error) {
    console.log("Get last address error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


