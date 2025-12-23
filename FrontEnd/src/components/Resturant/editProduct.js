import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  Alert,
  Modal, 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../api/context/authContext";
import { updateResturantProductApi } from "../../api/addResturantProducts.js";

export default function EditProduct({ product, close, refreshList }) {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [veg, setVeg] = useState(product?.veg ?? true);
  const [available, setAvailable] = useState(product?.available ?? true);
  const [discount, setDiscount] = useState(product?.discount?.toString() || "");
  const [selectedImage, setSelectedImage] = useState(product?.image ? { uri: product.image } : null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setSelectedImage({
        uri: img.uri,
        name: img.fileName || "product.jpg",
        type: img.mimeType || "image/jpeg",
      });
    }
  };

 const handleUpdate = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("veg", veg);
    formData.append("available", available);
    formData.append("discount", discount || 0);
    formData.append("restaurantId", user.restaurantId);

    if (selectedImage?.uri && !selectedImage.uri.startsWith("http")) {
      formData.append("image", {
        uri: selectedImage.uri,
        name: selectedImage.name || "product.jpg",
        type: "image/jpeg",
      });
    }

    const res = await updateResturantProductApi(product._id, formData);

    if (res.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.message || "Product updated successfully!",
        position: "top",
        visibilityTime: 2000,
      });

      // ✅ Update product in ProductsList state directly
      if (refreshList) refreshList(); 

      close(); // close modal
    } else {
      Alert.alert("Error", res.message || "Failed to update product");
    }
  } catch (err) {
    console.log("ERROR:", err);
    Alert.alert("Error", "Something went wrong!");
  }
};


  return (
    <Modal visible={true} animationType="slide">
      <ScrollView style={{ padding: 20, backgroundColor: "#f2f2f7" }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
          Edit Product
        </Text>

        <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 20, elevation: 4 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", marginBottom: 6 }}>Product Name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Enter name" style={styles.input} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", marginBottom: 6 }}>Category</Text>
              <TextInput value={category} onChangeText={setCategory} placeholder="Pizza, Burger..." style={styles.input} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", marginBottom: 6 }}>Price (₹)</Text>
              <TextInput value={price} onChangeText={setPrice} placeholder="Enter price" keyboardType="number-pad" style={styles.input} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", marginBottom: 6 }}>Discount (%)</Text>
              <TextInput value={discount} onChangeText={setDiscount} placeholder="Optional" keyboardType="number-pad" style={styles.input} />
            </View>
          </View>

          <Text style={{ fontWeight: "700", marginBottom: 6 }}>Description</Text>
          <TextInput value={description} onChangeText={setDescription} multiline placeholder="Enter description" style={{ ...styles.input, height: 110, textAlignVertical: "top" }} />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Veg</Text>
            <Switch value={veg} onValueChange={setVeg} />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Available</Text>
            <Switch value={available} onValueChange={setAvailable} />
          </View>

          <Text style={{ fontWeight: "700", marginBottom: 8 }}>Product Image</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={{ fontWeight: "600" }}>Select Image</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image source={{ uri: selectedImage.uri }} style={{ width: "100%", height: 220, borderRadius: 15, marginBottom: 20 }} />
          )}

          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 15 }}>
            <TouchableOpacity onPress={close} style={{ backgroundColor: "#555", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: "tomato", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = {
  input: { borderWidth: 1, padding: 12, borderRadius: 12, borderColor: "#ccc", marginBottom: 18, backgroundColor: "#fafafa" },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  toggleLabel: { fontWeight: "700" },
  imagePicker: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 12, alignItems: "center", marginBottom: 15 },
};
