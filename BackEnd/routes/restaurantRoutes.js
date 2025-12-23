import express from 'express';
import { createRestaurant,getAllRestaurants ,updateRestaurant,deleteRestaurant} from '../controllers/restaurantController.js';  
import upload from "../middleware/upload.js";
const router = express.Router();

router.post('/add-restaurants', upload.single('image'), createRestaurant);
router.get('/get-restaurants', getAllRestaurants);
router.put('/update-restaurant/:id', upload.single('image'), updateRestaurant);
router.post('/delete-restaurant/:id',deleteRestaurant )
export default router;