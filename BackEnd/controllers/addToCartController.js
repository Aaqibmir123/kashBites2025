import cartModel from "../models/cartModel.js";

export const addToCartController = async (req, res) => {
    console.log("Add to Cart Controller called with:", req.body);   
  try {

    const { cartData } = req.body;

    const userId = cartData.userId;

    const product = {
      productId: cartData.productId,
      name: cartData.name,
      price: cartData.price,
      description: cartData.description,
      image: cartData.image,
      qty: cartData.qty
    };

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: []
      });
    }

    const existing = cart.items.find(
      item => item.productId?.toString() === product.productId
    );

    if (existing) {
      existing.qty += product.qty;
    } else {
      cart.items.push(product);
    }

    await cart.save();

    return res.status(200).json({
      message: "Item added to cart ✅",
      cart
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
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


