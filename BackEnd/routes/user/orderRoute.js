import express from "express";
import { placeOrder,userOrders } from "../../controllers/user/orderController.js";

const router = express.Router();

router.post("/place", placeOrder);
router.get("/:userId", userOrders);


export default router;
