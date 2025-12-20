import ResturantProduct from "../../models/Resturants/addProducts.js";

export const createProduct = async (req, res) => {
  try {
   

    const {
      name,
      description,
      price,
      category,
      veg,
      available,
      discount,
      restaurantId
    } = req.body;

    // Image path
    let imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("IMAGE PATH:", imagePath);

    // 👉 Save to DB
    const newProduct = new ResturantProduct({
      name,
      description,
      price,
      category,
      veg: veg === "true",            // convert string → boolean
      available: available === "true",
      discount,
      restaurantId,
      image: imagePath,
    });

    await newProduct.save();

    return res.json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });

  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
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

//update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      price,
      category,
      veg,
      available,
      discount,
      restaurantId
    } = req.body;
    // Image path
    let imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("IMAGE PATH:", imagePath);
    const updatedData = {
      name,
      description,
      price,
      category,
      veg: veg === "true",            // convert string → boolean
      available: available === "true",
      discount,
      restaurantId,
    };
    if (imagePath) {
      updatedData.image = imagePath;
    }
    const updatedProduct = await ResturantProduct.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
  catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try { 
    const { productId } = req.params;
    await ResturantProduct.findByIdAndDelete(productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

//get all products
export const getAllProducts = async (req, res) => {
  try { 
    const products = await ResturantProduct.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  }
  catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

//get single product
export const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ResturantProduct.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  }
  catch (err) {
    console.error("Get Single Product Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};












