import express from "express";

import addressRoute from "./addressRoute.js";
import addToCartRoute from "./addToCartRoute.js";
import orderRoute from "./orderRoute.js";
import productRoute from "./productsRoute.js";
import showProducts from "./getAllProductsRoute.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import getResturantListRoutes from "./getResturantListRoutes.js";
import userProfileRoute from "./userProfileRoute.js";
import userNotificationRoute from "./userNotificationRoute.js";
import favoriteRoute from "./favoriteRoute.js";
import support from "./support.js";

const router = express.Router();

/* ===== PUBLIC ROUTES ===== */
router.use("/products", productRoute);
router.use("/showProducts", showProducts);

/* ===== PROTECTED USER ROUTES ===== */
router.use("/notifications", authMiddleware, userNotificationRoute);

router.use("/address", authMiddleware, addressRoute);
router.use("/cart", authMiddleware, addToCartRoute);
router.use("/orders", authMiddleware, orderRoute);
router.use("/restaurantsList", getResturantListRoutes);
router.use("/profile", authMiddleware, userProfileRoute);
router.use("/favorite", authMiddleware, favoriteRoute);
router.use("/support", authMiddleware, support);

export default router;
