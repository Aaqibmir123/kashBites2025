import Restaurant from "../../models/addResturantModel.js";
import ResturantProduct from "../../models/resturants/addProducts.js";

/* ================= GET ALL RESTAURANTS ================= */
export const getResturantListController = async (req, res) => {
  try { 
    const restaurants = await Restaurant.find({});
    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({  
        success: false, 
        message: "Server Error: Unable to fetch restaurants." 
    });
  }
};

export const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const products = await ResturantProduct.find({ restaurantId });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

