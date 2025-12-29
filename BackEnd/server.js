import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

/* ===== USER ROUTES ===== */
import authRoutes from "./routes/auth/index.js";
import userRoutes from "./routes/user/index.js";

/* ===== RESTAURANT ROUTES (ONE ENTRY) ===== */
import restaurantRoutes from "./routes/resturant/index.js"; 

/* ===== ADMIN ROUTES (ONE ENTRY) ===== */
import adminRoutes from "./routes/admin/index.js";

dotenv.config();
const app = express();


/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


/* ===== DB ===== */
connectDB();

/* ===== BASE ===== */
app.get("/", (req, res) => {
  res.send("API Running...");
});

/* ===== STATIC ===== */
app.use("/uploads", express.static("uploads"));

/* ===== ROUTES ===== */

// auth (login/register)
app.use("/api", authRoutes);

// user (cart, address, orders, profile, etc.)
app.use("/api/user", userRoutes);

// restaurant (products, orders, notifications, dashboard, address)
app.use("/api/restaurant", restaurantRoutes);

// admin (dashboard, notifications, users, etc.)
app.use("/api/admin", adminRoutes);

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
