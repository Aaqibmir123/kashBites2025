import express from "express";
import {
  getTodayStats,
  getWeeklyStats,
  getMonthlyStats,
} from "../../controllers/ResturantsController/restaurantDashboardController.js";

const router = express.Router();

router.get("/today", getTodayStats);
router.get("/weekly", getWeeklyStats);
router.get("/monthly", getMonthlyStats);

export default router;
