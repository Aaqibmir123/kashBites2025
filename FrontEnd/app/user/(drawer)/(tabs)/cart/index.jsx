import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useContext, useState, useEffect, useMemo } from "react";
import { getCartApi } from "../../../../../src/api/user/addTocartApi.js";
import { AuthContext } from "../../../../../src/api/context/authContext.js";
import { useRouter } from "expo-router";
import { BASE_IMAGE_URL } from "../../../../../src/api/apiConfig.js";
import { Ionicons } from "@expo/vector-icons";
import { useCheckout } from "../../../../../src/api/context/checkoutContext.js";
import AppHeader from "../../../../../src/components/AppHeaderIcon.jsx";
import { CartContext } from "../../../../../src/api/context/CartContext.js";
export default function CartPage() {
  const { user } = useContext(AuthContext);
  const { setBilling } = useCheckout();
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const userId = user?._id;
  const { setCartQty } = useContext(CartContext);


  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (userId) fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const res = await getCartApi();
      console.log("✅ Cart fetch response:", res.data.items.length);
      setCartItems(res?.data?.items || []);
      setCartQty(res?.data?.items.length || 0); // ✅ UPDATE CART QTY
    } catch (err) {
      console.log("❌ Cart fetch error:", err);
    }
  };

  /* ================= GROUP BY RESTAURANT ================= */
  const groupedCart = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = [];
      }
      acc[item.restaurantId].push(item);
      return acc;
    }, {});
  }, [cartItems]);

  /* ================= QTY UPDATE (UI ONLY) ================= */
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              qty: item.qty + 1,
              price: item.unitPrice * (item.qty + 1),
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? {
                ...item,
                qty: item.qty - 1,
                price: item.unitPrice * (item.qty - 1),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  /* ================= CHECKOUT PER RESTAURANT ================= */
  const checkoutRestaurant = (restaurantId, items) => {
    const totalAmount = items.reduce((sum, i) => sum + i.price, 0);

    setBilling({
      cartItems: items,
      itemTotal: totalAmount,
      restaurantId, // ✅ CORRECT RESTAURANT ID
    });

    router.push("/user/(tabs)/cart/addAddress");
  };

  /* ================= CART EMPTY ================= */
  // if (cartItems.length === 0) {
  //   return (
  //     <View style={styles.center}>
  //       <Text>Your cart is empty</Text>
  //     </View>
  //   );
  // }

  /* ================= UI ================= */
  return (

    <View style={styles.container}>
      {/* 🔝 FIXED HEADER */}
      <AppHeader />
    <FlatList
      data={Object.entries(groupedCart)}
      keyExtractor={([restaurantId]) => restaurantId}
      contentContainerStyle={{ paddingBottom: 120 }}
      ListHeaderComponent={
        <Text style={styles.infoText}>
          Items are grouped by restaurant.  
          Checkout separately for each restaurant.
        </Text>
      }
      renderItem={({ item }) => {
        const [restaurantId, items] = item;
        const restaurantTotal = items.reduce((sum, i) => sum + i.price, 0);

        return (
          <View style={styles.restaurantBox}>
            {/* RESTAURANT HEADER */}
            <Text style={styles.restaurantTitle}>
              Restaurant {restaurantId.slice(-4)}
            </Text>

            {/* ITEMS */}
            {items.map((item) => {
              const imageUrl =
                item.image && item.image.startsWith("/")
                  ? `${BASE_IMAGE_URL}${item.image}`
                  : "https://cdn-icons-png.flaticon.com/512/837/837760.png";

              return (
                <View key={item._id} style={styles.card}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>₹ {item.price}</Text>

                    <View style={styles.qtyRow}>
                      {item.qty > 1 ? (
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => decreaseQty(item._id)}
                        >
                          <Text style={styles.qtyText}>−</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => decreaseQty(item._id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      )}

                      <Text style={styles.qty}>{item.qty}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtnDark}
                        onPress={() => increaseQty(item._id)}
                      >
                        <Text style={styles.qtyTextWhite}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* TOTAL + CHECKOUT */}
            <View style={styles.checkoutBox}>
              <Text style={styles.totalText}>Total ₹ {restaurantTotal}</Text>

              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => checkoutRestaurant(restaurantId, items)}
              >
                <Text style={styles.checkoutText}>
                  Checkout this restaurant
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  infoText: {
    textAlign: "center",
    color: "#555",
    marginVertical: 10,
    fontSize: 13,
  },

  restaurantBox: {
    backgroundColor: "#FFF",
    margin: 12,
    padding: 12,
    borderRadius: 16,
    elevation: 3,
  },

  restaurantTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#D81B60",
  },

  card: {
    flexDirection: "row",
    paddingVertical: 10,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  qtyBtn: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 6,
  },

  qtyBtnDark: {
    backgroundColor: "#222",
    padding: 6,
    borderRadius: 6,
  },

  deleteBtn: {
    backgroundColor: "#E53935",
    padding: 6,
    borderRadius: 6,
  },

  qty: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "bold",
  },

  qtyText: { fontSize: 18 },
  qtyTextWhite: { fontSize: 18, color: "#fff" },

  checkoutBox: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
  },

  totalText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },

  checkoutBtn: {
    backgroundColor: "#D81B60",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
