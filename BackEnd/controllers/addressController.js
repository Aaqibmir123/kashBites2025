import Address from  "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const { userId, name, phone, email, house, village, city, state, pincode } = req.body;
    const newAddress = new Address({
      userId,
      name,
        phone,
        email,
        house,
        village,
        city,
        state,
        pincode
    });
    await newAddress.save();
    return res.status(201).json({ message: "Address added successfully", address: newAddress });
  }
    catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
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

