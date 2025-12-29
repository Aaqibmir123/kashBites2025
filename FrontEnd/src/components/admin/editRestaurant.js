import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { updateRestaurantApi } from "../../api/admin/addResturantApi.js";
import Toast from "react-native-toast-message";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js"

// ===== base64 → blob =====
const base64ToBlob = (base64, mime) => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
};

export default function EditRestaurant({
  visible,
  onClose,
  restaurant,
  refreshList,
}) {
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    category: "",
    address: "",
  });


  const [imageUri, setImageUri] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);

  // ===== PREFILL =====
  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name || "",
        ownerName: restaurant.ownerName || "",
        phone: restaurant.phone || "",
        email: restaurant.email || "",
        category: restaurant.category || "",
        address: restaurant.address || "",
      });

      // 👇 existing image
      if (restaurant.image) {
        setImageUri(`${BASE_IMAGE_URL}${restaurant.image}`);
      } else {
        setImageUri(null);
      }

      setImageBlob(null);
    }
  }, [restaurant]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // ===== PICK IMAGE =====
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

  // ===== SAVE =====
  const handleSave = async () => {
    try {
      const id = restaurant?._id;
      if (!id) {
        Alert.alert("Error", "Restaurant ID not found");
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imageBlob) {
        formData.append("image", imageBlob, "restaurant.jpg");
      }

      const response = await updateRestaurantApi(id, formData);

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Restaurant updated successfully",
        });

        if (refreshList) refreshList(response.data);
        onClose();
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Update failed",
        });
      }
    } catch (error) {
      console.log("UPDATE ERROR", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Edit Restaurant</Text>

          {/* IMAGE FIELD */}
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={{ color: "#666" }}>Select Restaurant Image</Text>
            )}
          </TouchableOpacity>

          {/* ROW 1 */}
          <View style={styles.row}>
            <TextInput
              placeholder="Restaurant Name"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              style={styles.input}
            />
            <TextInput
              placeholder="Owner Name"
              value={form.ownerName}
              onChangeText={(v) => handleChange("ownerName", v)}
              style={styles.input}
            />
          </View>

          {/* ROW 2 */}
          <View style={styles.row}>
            <TextInput
              placeholder="Phone"
              value={form.phone}
              onChangeText={(v) => handleChange("phone", v)}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              style={styles.input}
            />
          </View>

          {/* ROW 3 */}
          <View style={styles.row}>
            <TextInput
              placeholder="Category"
              value={form.category}
              onChangeText={(v) => handleChange("category", v)}
              style={styles.input}
            />
          </View>

          {/* ADDRESS */}
          <TextInput
            placeholder="Address"
            value={form.address}
            onChangeText={(v) => handleChange("address", v)}
            style={styles.fullInput}
          />

          {/* BUTTONS */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "92%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  imageBox: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  input: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },

  fullInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  cancelBtn: {
    backgroundColor: "#9CA3AF",
    padding: 12,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },

  saveBtn: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
