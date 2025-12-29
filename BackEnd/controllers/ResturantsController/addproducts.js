import ResturantProduct from "../../models/resturants/addProducts.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      pricingType,
      variants,
      foodType,
      available,
      discount,
      restaurantId,
    } = req.body;


    let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new ResturantProduct({
      name,
      description,
      category,
      pricingType,
      foodType,
      available: available === "true" || available === true,
      discount,
      restaurantId,
      image: imagePath,
    });

    // 🔹 SINGLE PRICE
    if (pricingType === "single") {
      newProduct.price = price;
    }

    // 🔹 SIZE / QUANTITY
    if (pricingType !== "single" && variants) {
      newProduct.variants = JSON.parse(variants);
    }

    await newProduct.save();

    return res.status(201).json({
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
      pricingType,
      variants,
      foodType,
      available,
      discount,
    } = req.body;

    let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedData = {
      name,
      description,
      category,
      pricingType,
      foodType,
      available: available === "true" || available === true,
      discount,
    };

    if (pricingType === "single") {
      updatedData.price = price;
      updatedData.variants = [];
    }

    if (pricingType !== "single" && variants) {
      updatedData.variants = JSON.parse(variants);
      updatedData.price = undefined;
    }

    if (imagePath) {
      updatedData.image = imagePath;
    }

    const updatedProduct = await ResturantProduct.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Update Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
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
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
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
  } catch (err) {
    console.error("Get All Products Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
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
  } catch (err) {
    console.error("Get Single Product Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
  }
};
