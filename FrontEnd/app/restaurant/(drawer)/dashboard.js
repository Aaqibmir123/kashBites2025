import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import AppHeader from "../../../src/components/AppHeaderIcon";

import {
  getTodayDashboardApi,
  getWeeklyDashboardApi,
  getMonthlyDashboardApi,
} from "../../../src/api/resturants/resturantDashboard";

import { AuthContext } from "../../../src/api/context/authContext";
import OrderStatusSummary from "../../../src/components/Resturant/OrderStatusSummary";
import { getOrderStatusCountApi } from "../../../src/api/resturants/orders";

export default function RestaurantDashboard() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const restaurantId = user?.restaurantId;

  const [activeTab, setActiveTab] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  /* ================= STATS ================= */
  const [stats, setStats] = useState({
    today: { sales: 0, orders: 0 },
    weekly: { sales: 0, orders: 0 },
    monthly: { sales: 0, orders: 0 },
  });

  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    delivered: 0,
  });

  useEffect(() => {
    if (!restaurantId) return;
    fetchDashboardStats();
    fetchOrderStatusCounts();
  }, [restaurantId]);

  const fetchDashboardStats = async () => {
    try {
      const todayRes = await getTodayDashboardApi(restaurantId);
      const weeklyRes = await getWeeklyDashboardApi(restaurantId);
      const monthlyRes = await getMonthlyDashboardApi(restaurantId);

      setStats({
        today: {
          sales: todayRes?.totalSales || 0,
          orders: todayRes?.totalOrders || 0,
        },
        weekly: {
          sales: weeklyRes?.totalSales || 0,
          orders: weeklyRes?.totalOrders || 0,
        },
        monthly: {
          sales: monthlyRes?.totalSales || 0,
          orders: monthlyRes?.totalOrders || 0,
        },
      });
    } catch (err) {
      console.log("❌ Dashboard API error:", err);
    }
  };

  const fetchOrderStatusCounts = async () => {
    try {
      const res = await getOrderStatusCountApi(restaurantId);
      if (res?.success) {
        setOrderCounts(res.data);
      }
    } catch (err) {
      console.log("❌ Order status count API error:", err);
    }
  };

  return (
    <View style={styles.screen}>
      {/* ===== HEADER ===== */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <AppHeader  title="Dashboard"/>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ===== ORDER STATUS OVERVIEW ===== */}
        <OrderStatusSummary counts={orderCounts} />

        {/* ===== MONTHLY OVERALL ===== */}
        <View style={styles.row}>
          <View style={styles.bigCard}>
            <Text style={styles.bigTitle}>Total Sales</Text>
            <Text style={styles.bigValue}>₹ {stats.monthly.sales}</Text>
          </View>

          <View style={styles.bigCard}>
            <Text style={styles.bigTitle}>Total Orders</Text>
            <Text style={styles.bigValue}>{stats.monthly.orders}</Text>
          </View>
        </View>

        {/* ===== PERIOD CARDS ===== */}
        <View style={styles.row}>
          {["today", "weekly", "monthly"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.clickCard,
                activeTab === type && styles.activeCard,
              ]}
              onPress={() => {
                setActiveTab(type);
                setShowSummary(true);
              }}
            >
              <Text style={styles.clickValue}>₹ {stats[type].sales}</Text>
              <Text style={styles.clickTitle}>{type.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== SUMMARY ===== */}
        {showSummary && activeTab && (
          <View style={styles.salesCard}>
            <Text style={styles.salesTitle}>
              {activeTab.toUpperCase()} SUMMARY
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sales</Text>
              <Text style={styles.summaryValue}>
                ₹ {stats[activeTab].sales}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Orders</Text>
              <Text style={styles.summaryValue}>
                {stats[activeTab].orders}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  container: {
    padding: 14,
    paddingTop: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  bigCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },

  bigTitle: {
    fontSize: 13,
    color: "#666",
  },

  bigValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
    color: "#111",
  },

  clickCard: {
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#27ae60",
    backgroundColor: "#f2fff6",
  },

  clickValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  clickTitle: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
  },

  salesCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 24,
    elevation: 4,
  },

  salesTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2ecc71",
  },
});
