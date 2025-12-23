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

import { addResturantProductsApi } from "../../../../src/api/addResturantProducts";
import { AuthContext } from "../../../../src/api/context/authContext.js";
import ProductsList from "../../../../src/components/Resturant/displayResturantProducts.jsx";

export default function AddProduct() {
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [veg, setVeg] = useState(true);
  const [available, setAvailable] = useState(true);

  const [imageUri, setImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ---------------- BASE64 → BLOB ---------------- */
  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mime });

    return blob;
  };

  /* ---------------- IMAGE PICKER ---------------- */
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 1,
    });

    if (!result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];

    setSelectedImage(asset);
    setImageUri(asset.uri);
  };

  /* ---------------- SAVE PRODUCT ---------------- */
  const handleSave = async () => {
    if (!name || !price || !category) {
      Alert.alert("Error", "Name, Category & Price required");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("discount", discount || 0);
      formData.append("description", description);
      formData.append("veg", veg);
      formData.append("available", available);
      formData.append("restaurantId", user.restaurantId);

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
          text1: "Success",
          text2: "Product added successfully",
        });
        setRefreshKey((prev) => prev + 1); // 🔥 yahin

        setName("");
        setCategory("");
        setPrice("");
        setDiscount("");
        setDescription("");
        setVeg(true);
        setAvailable(true);
        setImageUri(null);
        setSelectedImage(null);
        setModalVisible(false);
      } else {
        Alert.alert("Error", res.message || "Failed");
      }
    } catch (err) {
      console.log("❌ ERROR:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f2f2f7" }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addBtn}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>+ Add Product</Text>
      </TouchableOpacity>

      {/* ---------------- MODAL ---------------- */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Add Product</Text>

          {/* ROW 1 */}
          <View style={styles.row}>
            <TextInput
              placeholder="Product Name"
              value={name}
              onChangeText={setName}
              style={styles.halfInput}
            />
            <TextInput
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
              style={styles.halfInput}
            />
          </View>

          {/* ROW 2 */}
          <View style={styles.row}>
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              style={styles.halfInput}
            />
            <TextInput
              placeholder="Discount"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="number-pad"
              style={styles.halfInput}
            />
          </View>

          {/* DESCRIPTION */}
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.description}
          />

          {/* SWITCHES */}
          <View style={styles.row}>
            <View style={styles.switchBox}>
              <Text>Veg</Text>
              <Switch value={veg} onValueChange={setVeg} />
            </View>

            <View style={styles.switchBox}>
              <Text>Available</Text>
              <Switch value={available} onValueChange={setAvailable} />
            </View>
          </View>

          {/* IMAGE */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={{ fontWeight: "600" }}>
              {imageUri ? "Change Image" : "Select Image"}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          )}

          {/* BUTTONS */}
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.btnText}>Save Product</Text>
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

/* ---------------- STYLES ---------------- */
const styles = {
  addBtn: {
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 10,
    alignSelf: "flex-end",
  },

  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  halfInput: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  description: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    height: 100,
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  switchBox: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  imagePicker: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  close: {
    textAlign: "center",
    marginTop: 12,
    color: "#555",
  },
};
