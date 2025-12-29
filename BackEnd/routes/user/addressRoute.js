import express from "express";
import {addAddress,getLastOrderAddress} from "../../controllers/user/addressController.js";
const router = express.Router();
router.post('/add-address', addAddress);
router.get('/get-addresses', getLastOrderAddress);

export default router;