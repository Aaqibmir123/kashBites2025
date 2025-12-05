import express from "express";
import {addAddress} from "../controllers/addressController.js";
const router = express.Router();
router.post('/add-address', addAddress);

export default router;