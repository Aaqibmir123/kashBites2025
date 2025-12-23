import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { getCartApi } from "../../../../src/api/addTocartApi.js";
import { AuthContext } from "../../../../src/api/context/authContext.js";
import { useRouter } from "expo-router";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints.js";
import { Ionicons } from "@expo/vector-icons";

export default function CartPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);


  const userId = user?._id;

  useEffect(() => {
    if (userId) fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const res = await getCartApi(userId);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.log("Cart fetch error:", err);
    }
  };

  /* ---------------- QTY HANDLERS (LOCAL UI) ---------------- */
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  /* ---------------- CHECKOUT (UNCHANGED LOGIC) ---------------- */
  const proceedToCheckout = () => {
    const item = cartItems[0];
    console.log(item,'itessm')

    router.push({
      pathname: "/(tabs)/cart/addAddress",
      params: {
        from: "orders",

        productId: item._id,
        productName: item.name,
        productPrice: item.price,
        productQty: item.qty,
        productDescription: item.description,
        productImage: item.image,
        restaurantId: item.restaurantId,
      },
    });
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image
            ? `${BASE_IMAGE_URL}${item.image}`
            : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
        }}
        style={styles.image}
      />

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

        <Text style={styles.total}>Total: ₹ {item.price * item.qty}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Ionicons name="arrow-back" size={22} color="#fff" /> */}
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

          {/* BOTTOM BAR */}
          <View style={styles.bottom}>
            <Text style={styles.subtotal}>Subtotal: ₹ {getSubtotal()}</Text>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={proceedToCheckout}
            >
              <Text style={styles.checkoutText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },

  header: {
    backgroundColor: "#D81B60",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
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
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  price: {
    fontSize: 14,
    marginVertical: 4,
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

  qtyText: {
    fontSize: 18,
  },

  qtyTextWhite: {
    fontSize: 18,
    color: "#fff",
  },

  total: {
    marginTop: 6,
    fontWeight: "bold",
    color: "green",
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

  subtotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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
