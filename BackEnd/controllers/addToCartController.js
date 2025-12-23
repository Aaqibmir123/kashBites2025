import cartModel from "../models/cartModel.js";

export const addToCartController = async (req, res) => {
  try {
    const { cartData } = req.body;

    const {
      userId,
      productId,
      name,
      description,
      image,
      unitPrice,
      qty,
      size,
      restaurantId
    } = cartData;

    if (!userId || !productId || !unitPrice) {
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
      restaurantId
    };

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [product],
      });

      await cart.save();

      return res.status(200).json({
        success: true,
        message: "Item added to cart ✅",
        cart,
      });
    }

    // ✅ SAFE CHECK (no crash)
    const existingItem = cart.items.find(
      (item) =>
        item.productId &&
        item.productId.toString() === productId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.qty += qty;
      existingItem.price = existingItem.qty * existingItem.unitPrice;
    } else {
      cart.items.push(product);
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart ✅",
      cart,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getCartController = async (req, res) => {
  try {
    const { userId } = req.params;  
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", data: [] });
    }
    return res.status(200).json({ message: "Cart fetched successfully", data: cart });
    } catch (error) {   
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const removeFromCartController = async (req, res) => {
  try {
    console.log("Remove request body:", req.body);

    const { userId, productId } = req.body.cartData;   // ✅ FIXED

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ REMOVE BY CART ITEM _id
    cart.items = cart.items.filter(
      item => item._id.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      message: "Item removed successfully ✅",
      cart
    });

  } catch (error) {
    console.log("Remove error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


