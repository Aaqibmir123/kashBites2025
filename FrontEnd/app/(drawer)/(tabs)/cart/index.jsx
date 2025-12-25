import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useContext, useState, useEffect, useMemo } from "react";
import { getCartApi } from "../../../../src/api/addTocartApi.js";
import { AuthContext } from "../../../../src/api/context/authContext.js";
import { useRouter } from "expo-router";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints.js";
import { Ionicons } from "@expo/vector-icons";
import { useCheckout } from "../../../../src/api/context/checkoutContext.js"; // ✅ ADD

export default function CartPage() {
  const { user } = useContext(AuthContext);
  const { setBilling } = useCheckout(); // ✅ CONTEXT
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const userId = user?._id;

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (userId) fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const res = await getCartApi(userId);
      setCartItems(res?.data?.items || []);
    } catch (err) {
      console.log("❌ Cart fetch error:", err);
    }
  };

  /* ================= QTY UPDATE (UI ONLY) ================= */
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              qty: item.qty + 1,
              price:
                (item.unitPrice || item.price / item.qty) *
                (item.qty + 1),
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
                price:
                  (item.unitPrice || item.price / item.qty) *
                  (item.qty - 1),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  /* ================= TOTAL ================= */
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  /* ================= CHECKOUT (UPDATED) ================= */
  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;

    // ✅ SET DATA INTO CHECKOUT CONTEXT
    setBilling((prev) => ({
      ...prev,
      cartItems: cartItems,
      itemTotal: totalAmount,
    }));

    // ✅ NO PARAMS
    router.push("/(tabs)/cart/addAddress");
  };

  /* ================= ITEM ================= */
  const renderItem = ({ item }) => {
    const imageUrl =
      item.image && item.image.startsWith("/")
        ? `${BASE_IMAGE_URL}${item.image}`
        : "https://cdn-icons-png.flaticon.com/512/837/837760.png";

    return (
      <View style={styles.card}>
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
                <Ionicons name="trash-outline" size={18} color="#fff" />
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
  };

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>MY CART</Text>
      </View>

      {cartItems.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Your cart is empty
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 140 }}
          />

          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={proceedToCheckout}
            >
              <Text style={styles.checkoutText}>
                Confirm Order ₹ {totalAmount}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F7" },

  header: {
    backgroundColor: "#D81B60",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 12,
    padding: 12,
    borderRadius: 14,
    elevation: 2,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
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

  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  checkoutBtn: {
    backgroundColor: "#D81B60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
