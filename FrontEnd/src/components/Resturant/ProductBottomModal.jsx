import React, { useEffect, useState, useContext } from "react";
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
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js";
import { CartContext } from "../../../src/api/context/CartContext";

export default function ProductBottomModal({
  visible,
  product,
  isFavorite,
  onToggleFavorite,
  onClose,
}) {
  const { addToCart } = useContext(CartContext);

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  /* ================= RESET ON OPEN ================= */
  useEffect(() => {
    if (visible && product) {
      setQty(1);

      if (product.pricingType !== "single" && product.variants?.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [visible, product]);

  if (!product) return null;

  /* ================= PRICE ================= */
  const unitPrice =
    product.pricingType === "single"
      ? product.price
      : selectedVariant?.price || 0;

  const totalAmount = unitPrice * qty;

  /* ================= ADD TO CART ================= */
 const handleAddToCart = async () => {
  try {
    const res = await addToCart({
      productId: product._id,
      name: product.name,
      description: product.description || "",
      unitPrice,
      qty,
      image: product.image,
      size: selectedVariant ? selectedVariant.label : null,
      restaurantId: product.restaurantId,
    });

    console.log("Add to Cart Response:", res);

    // ✅ CASE 1: Normal success
    if (res?.success) {
      Toast.show({
        type: "success",
        text1: res.message || "Added to Cart 🛒",
      });
      onClose();
      return;
    }

    // ✅ CASE 2: Item already exists (treat as success)
    if (res?.message === "Item already in cart") {
      Toast.show({
        type: "success",
        text1: "Item already in cart🛒",
        
      });
      // onClose();
      return;
    }

    // ❌ REAL ERROR
    Toast.show({
      type: "error",
      text1: res?.message || "Failed to add item",
    });

  } catch (error) {
    console.log("Add to cart error:", error);
    Toast.show({
      type: "error",
      text1: "Something went wrong",
    });
  }
};


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* CLOSE */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#111" />
          </TouchableOpacity>

          {/* IMAGE */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: product.image
                  ? `${BASE_IMAGE_URL}${product.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
              }}
              style={styles.image}
            />

            {/* ❤️ FAVORITE (REAL DB STATE) */}
            <TouchableOpacity
              style={styles.favBtn}
              onPress={() => onToggleFavorite(product._id)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#DC2626" : "#111"}
              />
            </TouchableOpacity>
          </View>

          {/* NAME */}
          <Text style={styles.name}>{product.name}</Text>

          {/* DESCRIPTION */}
          <Text style={styles.desc}>
            {product.description || "Fresh and delicious item"}
          </Text>

          {/* VARIANTS */}
          {product.pricingType !== "single" && (
            <>
              <Text style={styles.section}>
                {product.pricingType === "size"
                  ? "Choose Size"
                  : "Choose Quantity"}
              </Text>

              <View style={styles.variantRow}>
                {product.variants.map((v, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.variantBtn,
                      selectedVariant?.label === v.label &&
                        styles.variantActive,
                    ]}
                    onPress={() => setSelectedVariant(v)}
                  >
                    <Text
                      style={[
                        styles.variantText,
                        selectedVariant?.label === v.label &&
                          styles.variantTextActive,
                      ]}
                    >
                      {v.label} • ₹{v.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

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

          {/* ADD TO CART */}
          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <Text style={styles.addText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 4,
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },

  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 6,
    borderRadius: 20,
    elevation: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    color: "#111827",
  },

  desc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 18,
  },

  section: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  variantRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },

  variantBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  variantActive: {
    borderColor: "#16A34A",
    backgroundColor: "#ECFDF5",
  },

  variantText: {
    fontSize: 13,
    color: "#374151",
  },

  variantTextActive: {
    color: "#166534",
    fontWeight: "600",
  },

  totalRow: {
    marginTop: 20,
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
    marginTop: 2,
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
    marginTop: 20,
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
