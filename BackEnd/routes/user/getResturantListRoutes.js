import express from "express";
import { getResturantListController ,getProductsByRestaurant} from  "../../controllers/user/getResturantListConytroller.js";
const router = express.Router();
router.get("/get-restaurants", getResturantListController);
router.get("/products/:restaurantId", getProductsByRestaurant);
export default router;
