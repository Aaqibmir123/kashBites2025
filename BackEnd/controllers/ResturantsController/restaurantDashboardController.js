import Order from "../../models/Order.js";

/* =========================
   DATE HELPERS
========================= */
const getTodayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const getMonthStart = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/* =========================
   TODAY SALES
========================= */
export const getTodayStats = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const start = getTodayStart();

    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: start },
      status: { $ne: "Rejected" },
    });

    const totalSales = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    res.json({
      success: true,
      totalOrders: orders.length,
      totalSales,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   WEEKLY SALES (LAST 7 DAYS)
========================= */
export const getWeeklyStats = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const start = getDaysAgo(7);

    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: start },
      status: { $ne: "Rejected" },
    });

    const totalSales = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    res.json({
      success: true,
      totalOrders: orders.length,
      totalSales,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   MONTHLY SALES
========================= */
export const getMonthlyStats = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const start = getMonthStart();

    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: start },
      status: { $ne: "Rejected" },
    });

    const totalSales = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    res.json({
      success: true,
      totalOrders: orders.length,
      totalSales,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
