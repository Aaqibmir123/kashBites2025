import React, { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  /* ================= ADDRESS ================= */
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ================= BILLING ================= */
  const [billing, setBilling] = useState({
    cartItems: [],          // 🔥 IMPORTANT
    itemTotal: 0,
    deliveryFee: 30,
    platformFee: 5,
    tax: 0,
    tip: 0,
    grandTotal: 0,
  });

  /* ================= CALCULATE BILL ================= */
  const calculateBill = ({
    itemTotal,
    deliveryFee = 30,
    platformFee = 5,
    tip = 0,
  }) => {
    const tax = Math.round(itemTotal * 0.05); // 5% GST
    const grandTotal = itemTotal + deliveryFee + platformFee + tax + tip;

    setBilling((prev) => ({
      ...prev,        // 🔥 cartItems safe
      itemTotal,
      deliveryFee,
      platformFee,
      tax,
      tip,
      grandTotal,
    }));
  };

  /* ================= RESET ================= */
  const resetCheckout = () => {
    setAddress({
      name: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
    });

    setBilling({
      cartItems: [],
      itemTotal: 0,
      deliveryFee: 30,
      platformFee: 5,
      tax: 0,
      tip: 0,
      grandTotal: 0,
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        address,
        setAddress,
        billing,
        setBilling,
        calculateBill,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
