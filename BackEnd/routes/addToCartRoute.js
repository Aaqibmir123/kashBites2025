import express from 'express';
import { addToCartController,getCartController,removeFromCartController } from '../controllers/addToCartController.js';
const router = express.Router();
router.post('/add-to-cart', addToCartController);
router.get('/get-cart/:userId', getCartController);
router.post('/remove-from-cart', removeFromCartController)
export default router;