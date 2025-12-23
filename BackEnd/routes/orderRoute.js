import express from "express";
import { placeOrder,userOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/user-orders/:userId", userOrders);

export default router;
