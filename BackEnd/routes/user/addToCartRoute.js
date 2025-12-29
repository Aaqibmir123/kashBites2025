import express from 'express';
import { addToCartController,getCartController,removeFromCartController,clearCart } 
from '../../controllers/user/addToCartController.js';
const router = express.Router();
router.post('/add', addToCartController);
router.get('/:userId', getCartController);
router.post('/remove', removeFromCartController)
router.post("/:userId", clearCart);

export default router;