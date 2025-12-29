import cartModel from "../../models/cartModel.js";

export const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      name,
      description,
      image,
      unitPrice,
      qty,
      size,
      restaurantId,
    } = req.body;
    console.log("ADD TO CART REQ BODY:", req.body);

    // ✅ Validation
    if (!productId || !unitPrice || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart data",
      });
    }

    let cart = await cartModel.findOne({ userId });

    const product = {
      productId,
      name,
      description,
      image,
      unitPrice,
      qty,
      size,
      price: unitPrice * qty,
      restaurantId,
    };

    // 🛒 FIRST ITEM
    if (!cart) {
      cart = new cartModel({
        userId,
        items: [product],
      });

      await cart.save();

      return res.status(200).json({
        success: true,
        message: "Item added to cart ✅",
        data: cart,
      });
    }

    // 🔍 CHECK EXISTING ITEM (same product + same size)
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    // ⚠️ ALREADY IN CART
    if (existingItem) {
      return res.status(200).json({
        success: false,
        message: "Item already in cart",
      });
    }

    // ➕ ADD NEW ITEM (NO RESTAURANT RESTRICTION)
    cart.items.push(product);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart ✅",
      data: cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ===============================
   GET CART
================================ */
export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
        },
      });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

    return res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        totalAmount,
      },
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ===============================
   REMOVE FROM CART
================================ */
export const removeFromCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItemId } = req.body; // 🔑 cart item _id

    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        message: "cartItemId is required",
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== cartItemId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully ✅",
      data: cart,
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ===============================
   CLEAR CART
================================ */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "restaurantId is required",
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    // ✅ REMOVE ONLY SELECTED RESTAURANT ITEMS
    cart.items = cart.items.filter(
      (item) =>
        item.restaurantId.toString() !== restaurantId.toString()
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant items removed from cart ✅",
      data: cart,
    });
  } catch (error) {
    console.log("CLEAR CART BY RESTAURANT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

