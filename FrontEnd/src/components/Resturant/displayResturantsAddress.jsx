import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  getRestaurantAddressByIdApi,
  AddRestaurantAddress,
} from "../../api/resturants/restaurantAddressApi";
import { AuthContext } from "../../api/context/authContext";

export default function RestaurantDetails() {
  const { user } = useContext(AuthContext);

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user?.restaurantId) {
      fetchRestaurant();
    }
  }, [user]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const res = await getRestaurantAddressByIdApi(user.restaurantId);
      setRestaurant(res.data);
      setForm(res.data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load restaurant details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const updateRestaurant = async () => {
    try {
      const payload = {
        updateId: form._id,
        restaurantId: user.restaurantId,
        restaurantName: form.restaurantName,
        ownerName: form.ownerName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        latitude: form.location?.latitude || "",
        longitude: form.location?.longitude || "",
        fssaiNumber: form.fssaiNumber || "",
        gstNumber: form.gstNumber || "",
      };

      await AddRestaurantAddress(payload);

      Toast.show({
        type: "success",
        text1: "Updated 🎉",
        text2: "Restaurant details updated",
      });

      setEditModal(false);
      fetchRestaurant();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Update failed",
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D81B60" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>No restaurant details found</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* 🔥 HEADER WITH BACK ICON */}
   

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Detail label="Restaurant Name" value={restaurant.restaurantName} />
          <Detail label="Owner Name" value={restaurant.ownerName} />
          <Detail label="Phone" value={restaurant.phone} />
          <Detail label="Address" value={restaurant.address} />
          <Detail label="City" value={restaurant.city} />
          <Detail label="State" value={restaurant.state} />
          <Detail label="Pincode" value={restaurant.pincode} />
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditModal(true)}
        >
          <Text style={styles.editText}>Edit Restaurant</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={editModal} animationType="slide">
        <ScrollView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Edit Restaurant</Text>
            <TouchableOpacity onPress={() => setEditModal(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <Input
            label="Restaurant Name"
            value={form.restaurantName}
            onChangeText={(v) => handleChange("restaurantName", v)}
          />
          <Input
            label="Owner Name"
            value={form.ownerName}
            onChangeText={(v) => handleChange("ownerName", v)}
          />
          <Input
            label="Phone"
            keyboardType="numeric"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />
          <Input
            label="Address"
            value={form.address}
            onChangeText={(v) => handleChange("address", v)}
          />
          <Input
            label="City"
            value={form.city}
            onChangeText={(v) => handleChange("city", v)}
          />
          <Input
            label="State"
            value={form.state}
            onChangeText={(v) => handleChange("state", v)}
          />
          <Input
            label="Pincode"
            keyboardType="numeric"
            value={form.pincode}
            onChangeText={(v) => handleChange("pincode", v)}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={updateRestaurant}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

/* SMALL COMPONENTS */

const Detail = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

const Input = ({ label, ...props }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

/* STYLES */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f3f3f3" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  container: { padding: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },

  row: { marginBottom: 10 },
  label: { fontSize: 12, color: "#666" },
  value: { fontSize: 15, fontWeight: "600" },

  editBtn: {
    backgroundColor: "#D81B60",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  editText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  modal: { padding: 16, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: { fontSize: 18, fontWeight: "600" },

  inputLabel: { fontSize: 12, color: "#444", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },

  saveBtn: {
    backgroundColor: "#D81B60",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
