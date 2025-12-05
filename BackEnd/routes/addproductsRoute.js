import express from "express";
import { createProduct } from "../../controllers/ResturantsController/addproducts.js";     
const router = express.Router();

router.post("/add-product-resturant", createProduct);

export default router;