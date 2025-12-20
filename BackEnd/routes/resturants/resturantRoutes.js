import express from "express";
import upload from "../../middleware/upload.js";
import { createProduct ,getProductsByRestaurant,updateProduct,
    deleteProduct,getAllProducts,getSingleProduct} from "../../controllers/ResturantsController/addproducts.js";

const router = express.Router();

router.post("/add-product-resturant", upload.single("image"), createProduct);
router.post('/get-products/:restaurantId', getProductsByRestaurant);
router.put("/update-resturant-product/:productId", upload.single("image"), updateProduct);
router.delete("/delete-product/:productId",deleteProduct);
router.get("/get-all-products",getAllProducts);
router.get("/get-single-product/:productId",getSingleProduct);

export default router;
