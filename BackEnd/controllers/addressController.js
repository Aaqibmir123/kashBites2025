import Address from  "../models/Address.js";

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
    console.log("Add Address Request Body:", req.body);

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

export const getAddressesByUser = async (req, res) => {
    try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId });
    return res.status(200).json({ addresses });
    }
    catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
    }
};

