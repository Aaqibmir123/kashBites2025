import express from "express";
import { placeOrder,userOrders,getLastOrderAddress } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/user-orders/:userId", userOrders);
router.get("/last-address/:userId", getLastOrderAddress);


export default router;
