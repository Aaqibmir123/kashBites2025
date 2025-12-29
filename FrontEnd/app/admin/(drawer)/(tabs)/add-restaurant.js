import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import { addRestaurantApi } from "../../../../src/api/admin/addResturantApi.js";
import Toast from "react-native-toast-message";
import DisplayRestaurants from "../../../../src/components/admin/displayResturants";

/* ===== base64 → blob ===== */
const base64ToBlob = (base64, mime) => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
};

export default function AddRestaurant() {
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    category: "",
  });

  const [imageUri, setImageUri] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* ===== IMAGE PICKER ===== */
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 1,
    });

    if (!result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];
    setImageUri(asset.uri);
    setImageBlob(base64ToBlob(asset.base64, asset.type));
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    console.log("Submitting form:", form);
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imageBlob) {
        formData.append("image", imageBlob, "restaurant.jpg");
      }

      const response = await addRestaurantApi(formData);
      console.log("Add Restaurant Response:", response);

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Restaurant Added",
          text2: "Restaurant added successfully ✅",
        });

        setModalVisible(false);
        setForm({
          name: "",
          ownerName: "",
          phone: "",
          email: "",
          address: "",
          category: "",
        });
        setImageUri(null);
        setImageBlob(null);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: response.message || "Something went wrong",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Unable to add restaurant ❌",
      });
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Restaurants</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.btnText}>Add Restaurant</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Restaurant</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* ROW 1 */}
              <View style={styles.row}>
                <TextInput
                  placeholder="Restaurant Name"
                  style={styles.input}
                  value={form.name}
                  onChangeText={(v) => handleChange("name", v)}
                />
                <TextInput
                  placeholder="Owner Name"
                  style={styles.input}
                  value={form.ownerName}
                  onChangeText={(v) => handleChange("ownerName", v)}
                />
              </View>

              {/* ROW 2 */}
              <View style={styles.row}>
                <TextInput
                  placeholder="Phone"
                  keyboardType="numeric"
                  style={styles.input}
                  value={form.phone}
                  onChangeText={(v) => handleChange("phone", v)}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={form.email}
                  onChangeText={(v) => handleChange("email", v)}
                />
              </View>

              {/* ROW 3 */}
              <View style={styles.row}>
                <TextInput
                  placeholder="Category"
                  style={styles.input}
                  value={form.category}
                  onChangeText={(v) => handleChange("category", v)}
                />
                <TextInput
                  placeholder="Address"
                  style={styles.input}
                  value={form.address}
                  onChangeText={(v) => handleChange("address", v)}
                />
              </View>

              {/* IMAGE PICKER */}
              <TouchableOpacity
                style={styles.imageBox}
                onPress={pickImage}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <Text style={{ color: "#666" }}>Select Restaurant Image</Text>
                )}
              </TouchableOpacity>
            </ScrollView>

            {/* ACTION BUTTONS */}
            <View style={styles.footerBtns}>
              <TouchableOpacity
                style={[styles.footerBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.footerText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerBtn, styles.saveBtn]}
                onPress={handleSubmit}
              >
                <Text style={styles.footerText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DisplayRestaurants />
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f8f8" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: { fontSize: 24, fontWeight: "bold", color: "#333" },

  addBtn: {
    flexDirection: "row",
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: { color: "white", marginLeft: 6, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  modalBox: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  input: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#f2f2f2",
  },

  imageBox: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  footerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  footerBtn: {
    width: "48%",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },

  saveBtn: { backgroundColor: "#28a745" },
  cancelBtn: { backgroundColor: "#dc3545" },

  footerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
