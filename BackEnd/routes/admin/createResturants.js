import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
} from "../../controllers/admin/restaurantController.js";
import upload from "../../middleware/upload.js";
const router = express.Router();

router.post("/add", upload.single("image"), createRestaurant);
router.get("/", getAllRestaurants);
router.put("/:restaurantId", upload.single("image"), updateRestaurant);
router.delete("/:restaurantId", deleteRestaurant);
export default router;
