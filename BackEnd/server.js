import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

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
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ✅ DB Connection
connectDB();

// ✅ Base route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ✅ Static folder for images
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api", productRouter);
app.use("/api", addressRouter);
app.use("/api", profileRoutes);
app.use("/api", addToCartRoute);
app.use("/api", restaurantRoutes);
app.use("/api", resturantRoutes);
app.use("/api", orderRoute);
app.use("/api", notificationRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
