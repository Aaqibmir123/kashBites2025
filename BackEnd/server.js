import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import productRouter from "./routes/productsRoute.js";
import addressRouter from "./routes/addressRoute.js";
import profileRoutes from "./routes/profileRoute.js";
import addToCartRoute from "./routes/addToCartRoute.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import resturantRoutes from "./routes/resturants/resturantRoutes.js";
import orderRoute from "./routes/orderRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminProfileRoute from "./routes/admin/profile.js";
import resturantAddress from "./routes/resturants/restaurantAddressRoutes.js";
import orderRoutes from "./routes/resturants/orderRoutes.js";
import resturantNotificationRoute from './routes/resturants/notificationRoutes.js'
import resturantDashboardRoute from './routes/resturants/restaurantDashboardRoutes.js'

/* ✅ ONE ADMIN ROUTER */
import adminRoutes from "./routes/admin/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// DB
connectDB();

// base
app.get("/", (req, res) => {
  res.send("API Running...");
});

// static uploads
app.use("/uploads", express.static("uploads"));

/* ===== API ROUTES ===== */
app.use("/api", authRoutes);
app.use("/api", productRouter);
app.use("/api", addressRouter);
app.use("/api", profileRoutes);
app.use("/api", addToCartRoute);
app.use("/api", restaurantRoutes);
app.use("/api", resturantRoutes);
app.use("/api", orderRoute);
app.use("/api", notificationRoutes);
app.use("/api", adminProfileRoute);
app.use("/api", resturantAddress);
app.use("/api", orderRoutes);
app.use("/api", resturantNotificationRoute);
app.use("/api", resturantDashboardRoute);



/* ===== ADMIN (ONLY ONCE) ===== */
app.use("/api/admin", adminRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
