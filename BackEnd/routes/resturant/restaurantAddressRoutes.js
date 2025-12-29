import express from "express";
import { createOrUpdateRestaurantAddress ,getRestaurantById} from 
"../../controllers/ResturantsController/restaurantAddressController.js";

const router = express.Router();

router.post("/restaurantsAddress", createOrUpdateRestaurantAddress);
router.get("/getrestaurantsAddress/:restaurantId", getRestaurantById);


export default router;
