import addProducts from "../../models/resturants/addProducts.js";

export const getAllProducts = async (req, res) => {
    console.log("Fetching all products...");
    try {
        const products = await addProducts.find({}).populate('restaurantId', 'name');
        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.log("Error fetching all products:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
