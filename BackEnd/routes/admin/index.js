import express from "express";

import adminDashboardRoutes from "./adminDashboardRoutes.js";
import adminLiveOrdersRoutes from "./adminLiveOrdersRoutes.js";
import createResturants from "./createResturants.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import profile from "./profile.js";
import orderNotificationRoute from "./orderNotificationRoute.js";
import support from "./support.js";

const router = express.Router();

/* 🔐 ADMIN SECURITY LAYER */
router.use(authMiddleware);
router.use(allowRoles("admin"));

/* ===== ADMIN ROUTES ===== */
router.use("/dashboard", adminDashboardRoutes);
router.use("/orders", adminLiveOrdersRoutes);
router.use("/createResturants", createResturants);
router.use("/notifications", orderNotificationRoute);
router.use("/profile", profile);
router.use("/support", support);

export default router;
