import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCheckout } from "../../../../../src/api/context/checkoutContext";
import { BASE_IMAGE_URL } from "../../../../../src/api/apiConfig.js";
import TopHeader from "../../../../../src/components/TopHeader.jsx";
export default function ReviewOrder() {
  const router = useRouter();
  const { billing, setBilling, calculateBill } = useCheckout();

  const items = billing.cartItems || [];

  /* 🔒 SAFETY */
  if (!items.length) {
    router.replace("/user/(tabs)/cart");
    return null;
  }

  /* 🔧 UNIT PRICE */
  const getUnitPrice = (item) =>
    item.unitPrice ? item.unitPrice : item.price / item.qty;

  /* ➕ QTY INCREASE */
  const increaseQty = (id) => {
    const updated = items.map((item) => {
      if (item._id === id) {
        const unitPrice = getUnitPrice(item);
        const qty = item.qty + 1;
        return { ...item, qty, unitPrice, price: unitPrice * qty };
      }
      return item;
    });
    updateBill(updated);
  };

  /* ➖ QTY DECREASE */
  const decreaseQty = (id) => {
    const updated = items
      .map((item) => {
        if (item._id === id) {
          const unitPrice = getUnitPrice(item);
          const qty = item.qty - 1;
          if (qty <= 0) return null;
          return { ...item, qty, unitPrice, price: unitPrice * qty };
        }
        return item;
      })
      .filter(Boolean);

    if (!updated.length) {
      Alert.alert("Cart empty", "Add at least one item");
      return;
    }
    updateBill(updated);
  };

  /* 🧮 UPDATE BILL */
  const updateBill = (updatedItems) => {
    const total = updatedItems.reduce((sum, i) => sum + i.price, 0);

    setBilling((prev) => ({
      ...prev,
      cartItems: updatedItems,
      itemTotal: total,
    }));

    calculateBill({ itemTotal: total });
  };

  /* ➡️ CONTINUE */
  const continueToAddress = () => {
    router.push("/user/(tabs)/cart/addAddress");
  };

  /* 🧾 ITEM UI */
  const renderItem = ({ item }) => {
    const imageUrl = item.image
      ? `${BASE_IMAGE_URL}${item.image}`
      : "https://cdn-icons-png.flaticon.com/512/837/837760.png";

    return (
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹ {item.price}</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decreaseQty(item._id)}
            >
              <Ionicons name="remove" size={18} />
            </TouchableOpacity>

            <Text style={styles.qty}>{item.qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtnDark}
              onPress={() => increaseQty(item._id)}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔝 CUSTOM HEADER */}
      <View >
        <TopHeader
          title="Review Your Order"
          backTo="/user/(tabs)/order"
          bgColor="#D81B60"
          iconColor="#fff"
        />


        <View />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* 🔽 BILL + CONTINUE */}
      <View style={styles.bottom}>
        <Text style={styles.total}>Total: ₹ {billing.grandTotal}</Text>

        <TouchableOpacity style={styles.btn} onPress={continueToAddress}>
          <Text style={styles.btnText}>Proceed to Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F7" },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    margin: 12,
    elevation: 2,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },

  name: { fontSize: 16, fontWeight: "700" },
  price: { color: "#2E7D32", fontWeight: "700", marginTop: 4 },

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

  qty: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  total: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  btn: {
    backgroundColor: "#D81B60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
