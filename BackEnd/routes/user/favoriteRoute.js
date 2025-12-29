import express from "express";
import { toggleFavorite ,getFavorites} from "../../controllers/user/favoriteController.js";

const router = express.Router();

router.post("/toggle", toggleFavorite);
router.get("/get", getFavorites);
export default router;