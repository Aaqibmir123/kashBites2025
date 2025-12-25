import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";

import { addResturantProductsApi } from "../../../src/api/addResturantProducts";
import { AuthContext } from "../../../src/api/context/authContext";
import ProductsList from "../../../src/components/Resturant/displayResturantProducts";
import AppHeader from "../../../src/components/AppHeaderIcon";

export default function AddProduct() {
  const { user } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);

  /* ================= BASIC ================= */
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [available, setAvailable] = useState(true);

  /* ================= PRICING ================= */
  const [pricingType, setPricingType] = useState("single"); // single | size | quantity
  const [price, setPrice] = useState("");

  // 🔥 EMPTY BY DEFAULT (NO OPTION 1/2)
  const [variants, setVariants] = useState([]);

  /* ================= IMAGE ================= */
  const [imageUri, setImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  /* ================= BASE64 → BLOB ================= */
  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mime });
  };

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true, // 🔥 required for blob
      selectionLimit: 1,
    });

    if (!result.assets?.length) return;

    setSelectedImage(result.assets[0]);
    setImageUri(result.assets[0].uri);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!name || !category) {
      Alert.alert("Error", "Name & Category required");
      return;
    }

    if (pricingType === "single" && !price) {
      Alert.alert("Error", "Price required");
      return;
    }

    if (
      pricingType !== "single" &&
      (variants.length === 0 ||
        variants.some((v) => !v.label || !v.price))
    ) {
      Alert.alert(
        "Error",
        "Please add at least one option with label & price"
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("foodType", foodType);
      formData.append("available", available);
      formData.append("pricingType", pricingType);
      formData.append("restaurantId", user.restaurantId);

      if (pricingType === "single") {
        formData.append("price", price);
      } else {
        formData.append("variants", JSON.stringify(variants));
      }

      /* ✅ IMAGE AS BLOB */
      if (selectedImage?.base64) {
        const blob = base64ToBlob(
          selectedImage.base64,
          selectedImage.type || "image/jpeg"
        );
        formData.append("image", blob, "product.jpg");
      }

      const res = await addResturantProductsApi(formData);

      if (res.success) {
        Toast.show({
          type: "success",
          text1: "Product added successfully",
        });

        // RESET
        setModalVisible(false);
        setRefreshKey((p) => p + 1);
        setName("");
        setCategory("");
        setDescription("");
        setPrice("");
        setFoodType("veg");
        setVariants([]);
        setImageUri(null);
        setSelectedImage(null);
      } else {
        Alert.alert("Error", res.message || "Failed");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f7" }}>
      <AppHeader title="Add Products" />

      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            + Add Product
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Add Product</Text>

          <TextInput
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Category (Any)"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.textarea}
          />

          {/* 🔥 PRICING TYPE ALWAYS VISIBLE */}
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Pricing Type
          </Text>

          <View style={styles.row}>
            {["single", "size", "quantity"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeBtn,
                  pricingType === type && styles.typeActive,
                ]}
                onPress={() => setPricingType(type)}
              >
                <Text>
                  {type === "single"
                    ? "Single"
                    : type === "size"
                    ? "Size"
                    : "Quantity"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PRICE */}
          {pricingType === "single" && (
            <TextInput
              placeholder="Price"
              keyboardType="number-pad"
              value={price}
              onChangeText={setPrice}
              style={styles.input}
            />
          )}

          {/* VARIANTS */}
          {pricingType !== "single" &&
            variants.map((v, i) => (
              <View key={i} style={styles.row}>
                <TextInput
                  placeholder={
                    pricingType === "size"
                      ? "Size (Small / Medium / Large)"
                      : "Quantity (Half / Full / 1kg)"
                  }
                  value={v.label}
                  onChangeText={(val) => {
                    const copy = [...variants];
                    copy[i].label = val;
                    setVariants(copy);
                  }}
                  style={[styles.input, { width: "48%" }]}
                />

                <TextInput
                  placeholder="Price"
                  keyboardType="number-pad"
                  value={v.price}
                  onChangeText={(val) => {
                    const copy = [...variants];
                    copy[i].price = val;
                    setVariants(copy);
                  }}
                  style={[styles.input, { width: "48%" }]}
                />
              </View>
            ))}

          {pricingType !== "single" && (
            <TouchableOpacity
              onPress={() =>
                setVariants([...variants, { label: "", price: "" }])
              }
            >
              <Text style={{ color: "tomato", marginBottom: 10 }}>
                + Add Option
              </Text>
            </TouchableOpacity>
          )}

          {/* FOOD TYPE */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.foodBtn,
                foodType === "veg" && styles.veg,
              ]}
              onPress={() => setFoodType("veg")}
            >
              <Text>🟢 Veg</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.foodBtn,
                foodType === "nonveg" && styles.nonveg,
              ]}
              onPress={() => setFoodType("nonveg")}
            >
              <Text>🔴 Non-Veg</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchBox}>
            <Text>Available</Text>
            <Switch value={available} onValueChange={setAvailable} />
          </View>

          {/* IMAGE */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text>{imageUri ? "Change Image" : "Select Image"}</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Save Product
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      <ProductsList refreshKey={refreshKey} />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = {
  addBtn: {
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  textarea: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeBtn: {
    width: "30%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  typeActive: {
    backgroundColor: "#e6f7ed",
    borderColor: "tomato",
  },
  foodBtn: {
    width: "48%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  veg: {
    backgroundColor: "#e6f7ed",
    borderColor: "#2ecc71",
  },
  nonveg: {
    backgroundColor: "#fdecea",
    borderColor: "#e74c3c",
  },
  switchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  close: {
    textAlign: "center",
    marginTop: 12,
    color: "#555",
  },
};
