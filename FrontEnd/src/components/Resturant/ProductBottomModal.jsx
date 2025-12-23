import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { BASE_IMAGE_URL } from "../../api/constants/endpoints";
import { CartContext } from "../../../src/api/context/CartContext";

export default function ProductBottomModal({ visible, product, onClose }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [rating, setRating] = useState(4);
  const [favorite, setFavorite] = useState(false);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (visible) {
      setQty(1);
      setSelectedSize("Medium");
      setRating(4);
      setFavorite(false);
    }
  }, [visible]);

  if (!product) return null;

  const price = product.price || 0;
  const totalAmount = price * qty;


  
  // ✅ ADD TO CART HANDLER
  const handleAddToCart = () => {
    addToCart({
      productId: product._id, // ✅ FIX
      name: product.name,
      description: product.description || "",
      unitPrice: product.price, // ✅ FIX
      qty,
      image: product.image,
      size: selectedSize,
      restaurantId: product.restaurantId,
    });

    Toast.show({
      type: "success",
      text1: "Added to Cart 🛒",
      text2: `${product.name} added successfully`,
    });

    onClose(); // close modal
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* ❌ CLOSE */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#111" />
          </TouchableOpacity>

          {/* IMAGE + FAVORITE */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: product.image
                  ? `${BASE_IMAGE_URL}${product.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
              }}
              style={styles.image}
            />

            <TouchableOpacity
              style={styles.favBtn}
              onPress={() => setFavorite(!favorite)}
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={22}
                color={favorite ? "#DC2626" : "#111"}
              />
            </TouchableOpacity>
          </View>

          {/* NAME */}
          <Text style={styles.name}>{product.name}</Text>

          {/* ⭐ RATING */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={20}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.ratingText}>{rating}.0</Text>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.desc}>
            {product.description || "Fresh and delicious item"}
          </Text>

          {/* SIZE */}
          <Text style={styles.section}>Choose Size</Text>
          <View style={styles.sizeRow}>
            {["Small", "Medium", "Large"].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBtn,
                  selectedSize === size && styles.sizeActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* TOTAL + QTY */}
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalPrice}>₹{totalAmount}</Text>
            </View>

            <View style={styles.qtyBox}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => qty > 1 && setQty(qty - 1)}
              >
                <Ionicons name="remove" size={18} color="#166534" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Ionicons name="add" size={18} color="#166534" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 🛒 ADD TO CART */}
          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <Text style={styles.addText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  closeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 10,
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 190,
    borderRadius: 16,
  },

  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 6,
    borderRadius: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    color: "#111827",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  ratingText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },

  desc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },

  section: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  sizeRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },

  sizeBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  sizeActive: {
    borderColor: "#16A34A",
    backgroundColor: "#ECFDF5",
  },

  sizeText: {
    fontSize: 13,
    color: "#374151",
  },

  sizeTextActive: {
    color: "#166534",
    fontWeight: "600",
  },

  totalRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#166534",
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#16A34A",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  qtyBtn: {
    padding: 4,
  },

  qtyText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  addBtn: {
    marginTop: 18,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
