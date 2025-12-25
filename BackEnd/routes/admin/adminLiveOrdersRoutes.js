import express from "express";
import { getAdminLiveOrders } from "../../controllers/admin/adminLiveOrdersController.js";

const router = express.Router();

router.get("/live-orders", getAdminLiveOrders);

export default router;
