import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  DrawerActions,
} from "react-native";
import Toast from "react-native-toast-message";
import AppHeader from "../../../src/components/AppHeaderIcon";
import { useNavigation } from "@react-navigation/native";

import { AddRestaurantAddress } from "../../../src/api/resturants/restaurantAddressApi";
import { AuthContext } from "../../../src/api/context/authContext";
import RestaurantDetails from "../../../src/components/Resturant/displayResturantsAddress";
export default function RestaurantAddressForm() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    fssaiNumber: "",
    gstNumber: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitForm = async () => {
    if (
      !form.restaurantName ||
      !form.ownerName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill all required fields",
      });
      return;
    }

    try {
      const payload = {
        restaurantId: user?.restaurantId, // 🔥 YAHAN BHEJ RHE HAIN
        ...form,
      };

      await AddRestaurantAddress(payload);

      Toast.show({
        type: "success",
        text1: "Success 🎉",
        text2: "Address added successfully",
      });

      setTimeout(() => {
        setModalVisible(false);
      }, 600);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <AppHeader title="Add Address"/>
        </TouchableOpacity>

        <View style={{ width: 26 }} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addText}>+ Add Address</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.container}>
          {/* MODAL HEADER */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* BASIC INFO */}
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Restaurant Name <Text style={styles.star}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.restaurantName}
                  onChangeText={(v) => handleChange("restaurantName", v)}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  Owner Name <Text style={styles.star}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.ownerName}
                  onChangeText={(v) => handleChange("ownerName", v)}
                />
              </View>
            </View>

            <Text style={styles.label}>
              Phone <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}
              value={form.phone}
              onChangeText={(v) =>
                handleChange("phone", v.replace(/[^0-9]/g, ""))
              }
            />
          </View>

          {/* ADDRESS */}
          <View style={styles.card}>
            <Text style={styles.label}>
              Address <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={form.address}
              onChangeText={(v) => handleChange("address", v)}
            />

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  City <Text style={styles.star}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.city}
                  onChangeText={(v) => handleChange("city", v)}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  State <Text style={styles.star}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.state}
                  onChangeText={(v) => handleChange("state", v)}
                />
              </View>
            </View>

            <Text style={styles.label}>
              Pincode <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={6}
              value={form.pincode}
              onChangeText={(v) =>
                handleChange("pincode", v.replace(/[^0-9]/g, ""))
              }
            />
          </View>

          {/* LEGAL */}
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>FSSAI</Text>
                <TextInput
                  style={styles.input}
                  value={form.fssaiNumber}
                  onChangeText={(v) => handleChange("fssaiNumber", v)}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>GST</Text>
                <TextInput
                  style={styles.input}
                  value={form.gstNumber}
                  onChangeText={(v) => handleChange("gstNumber", v)}
                />
              </View>
            </View>
          </View>

          {/* SUBMIT */}
          <TouchableOpacity style={styles.btn} onPress={submitForm}>
            <Text style={styles.btnText}>Save Address</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      <RestaurantDetails />
    </View>
  );
}

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#D81B60",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 7,
  },
  addText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  container: {
    backgroundColor: "#f3f3f3",
    padding: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  close: {
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: "#333",
  },
  star: {
    color: "red",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 7,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "#D81B60",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
