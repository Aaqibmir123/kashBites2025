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
  const { addToCart } = useContext(CartContext);

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [favorite, setFavorite] = useState(false);

  /* ================= RESET ON OPEN ================= */
  useEffect(() => {
    if (visible && product) {
      setQty(1);
      setFavorite(false);

      // default variant (if exists)
      if (
        product.pricingType !== "single" &&
        product.variants?.length > 0
      ) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [visible, product]);

  if (!product) return null;

  /* ================= PRICE LOGIC ================= */
  const unitPrice =
    product.pricingType === "single"
      ? product.price
      : selectedVariant?.price || 0;

  const totalAmount = unitPrice * qty;

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      description: product.description || "",
      unitPrice,
      qty,
      image: product.image,
      variant: selectedVariant
        ? selectedVariant.label
        : null,
      restaurantId: product.restaurantId,
    });

    Toast.show({
      type: "success",
      text1: "Added to Cart 🛒",
      text2: `${product.name} added successfully`,
    });

    onClose();
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
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddToCart}
          >
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

  imageWrapper: { position: "relative" },

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

  qtyBtn: { padding: 4 },

  qtyText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: "600",
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
