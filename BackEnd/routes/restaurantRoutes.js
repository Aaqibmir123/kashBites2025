import express from 'express';
import { createRestaurant,getAllRestaurants ,updateRestaurant,deleteRestaurant} from '../controllers/restaurantController.js';  
const router = express.Router();
router.post('/add-restaurants', createRestaurant);
router.get('/get-restaurants', getAllRestaurants);
router.put('/update-restaurant/:id', updateRestaurant);
router.post('/delete-restaurant/:id',deleteRestaurant )
export default router;