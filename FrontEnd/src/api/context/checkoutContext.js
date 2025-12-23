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

    setBilling({
      itemTotal,
      deliveryFee,
      platformFee,
      tax,
      tip,
      grandTotal,
    });
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
        /* address */
        address,
        setAddress,

        /* billing */
        billing,
        setBilling,
        calculateBill,

        /* helpers */
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const useCheckout = () => useContext(CheckoutContext);
