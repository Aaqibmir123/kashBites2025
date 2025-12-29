import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";

import notificationRoutes from "./notificationRoutes.js";
import orderRoutes from "./orderRoutes.js";
import resturantRoutes from "./resturantRoutes.js";
import resturantAddressRoute from "./restaurantAddressRoutes.js";
import restaurantDashboardRoutes from "./restaurantDashboardRoutes.js";
import resturantProfileRoute from "./resturantProfileRoute.js";

const router = express.Router();

/* 🔐 SECURITY */
router.use(authMiddleware);
router.use(allowRoles("restaurant"));

/* ===== ROUTES ===== */
router.use("/notifications", notificationRoutes); // ✅ FIXED
router.use("/orders", orderRoutes);
router.use("/products", resturantRoutes);
router.use("/address", resturantAddressRoute);
router.use("/dashboard", restaurantDashboardRoutes);
router.use("/profile", resturantProfileRoute);

export default router;
