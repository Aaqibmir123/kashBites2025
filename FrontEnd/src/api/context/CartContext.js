import { createContext, useContext, useMemo, useState } from "react";
import { addToCartApi } from "../user/addTocartApi.js";
import { AuthContext } from "./authContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [cartQty, setCartQty] = useState(0); // ✅ NEW STATE

  /* ================= CART COUNT (TOTAL ITEMS) ================= */
  const cartCount = useMemo(() => cart.length, [cart]);

  /* ================= CART QTY COUNT (OPTIONAL) ================= */
  const cartQtyCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const addToCart = async (product) => {
    try {
      if (!user) return;

      const payload = {
        userId: user._id,
        productId: product.productId,
        name: product.name,
        description: product.description,
        unitPrice: product.unitPrice,
        qty: product.qty,
        price: product.unitPrice * product.qty,
        image: product.image,
        size: product.size,
        restaurantId: product.restaurantId,
      };

      const res = await addToCartApi(payload);

      if (res?.data?.item) {
        const exists = cart.find(
          (item) =>
            item.productId === product.productId && item.size === product.size
        );

        if (exists) {
          setCart(
            cart.map((item) =>
              item.productId === product.productId && item.size === product.size
                ? {
                    ...item,
                    qty: item.qty + product.qty,
                    price: (item.qty + product.qty) * item.unitPrice,
                  }
                : item
            )
          );
        } else {
          setCart([...cart, res.data.item]);
        }
      }

      return res;
    } catch (error) {
      console.log("Add to cart error:", error);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount, // ✅ item count
        cartQtyCount, // ✅ qty-based count (future)
        addToCart,
        removeFromCart,
        clearCart,
        setCartQty, // ✅ NEW FUNCTION
        cartQty, // ✅ NEW STATE
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
