import express from "express";
import upload from "../../middleware/upload.js";
import {
  createProduct,
  getProductsByRestaurant,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} from "../../controllers/ResturantsController/addproducts.js";

const router = express.Router();


/* ===== CREATE PRODUCT ===== */
router.post("/", upload.single("image"), createProduct);

/* ===== GET PRODUCTS BY RESTAURANT ===== */
router.get("/restaurant/:restaurantId", getProductsByRestaurant);

/* ===== UPDATE PRODUCT ===== */
router.put("/:productId", upload.single("image"), updateProduct);

/* ===== DELETE PRODUCT ===== */
router.delete("/:productId", deleteProduct);

/* ===== GET ALL PRODUCTS ===== */
router.get("/", getAllProducts);

/* ===== GET SINGLE PRODUCT ===== */
router.get("/:productId", getSingleProduct);

export default router;
