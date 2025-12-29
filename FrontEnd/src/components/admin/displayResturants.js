import {
  getAllRestaurantsApi,
  deleteRestaurantApi,
} from "../../api/admin/addResturantApi.js";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

import Toast from "react-native-toast-message";
import EditRestaurant from "./editRestaurant";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js"

export default function DisplayRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // ================= FETCH =================
  const fetchRestaurants = async () => {
    try {
      const response = await getAllRestaurantsApi();
      console.log(response,'responseresponseresponse')  
      if (response.success) setRestaurants(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ================= EDIT =================
  const handleEdit = (item) => {
    console.log(item,'items')
    setSelectedRestaurant(item);
    setModalVisible(true);
  };

  // update local list after edit
  const handleUpdateLocal = (updatedRestaurant) => {
    setRestaurants((prev) =>
      prev.map((item) =>
        item._id === updatedRestaurant._id ? updatedRestaurant : item
      )
    );
  };

  // ================= DELETE =================
  const handleDelete = async (restaurant) => {
    try {
      const response = await deleteRestaurantApi(restaurant._id);

      if (response.success) {
        setRestaurants((prev) =>
          prev.filter((item) => item._id !== restaurant._id)
        );

        Toast.show({
          type: "success",
          text1: "Restaurant deleted successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Delete failed",
        });
      }
    } catch (error) {
      console.log("DELETE ERROR", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      {/* IMAGE */}
      <Image
        source={{
          uri: item.image
            ? `${BASE_IMAGE_URL}${item.image}`
            : "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        }}
        style={styles.image}
      />

      <Text style={styles.cellSmall}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.ownerName}</Text>
      <Text style={styles.cell}>{item.phone}</Text>
      <Text style={styles.cell}>{item.category || "-"}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 150 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant List</Text>

      <View style={styles.header}>
        <Text style={styles.headerImage}>Img</Text>
        <Text style={styles.headerSmall}>#</Text>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Owner</Text>
        <Text style={styles.headerText}>Phone</Text>
        <Text style={styles.headerText}>Category</Text>
        <Text style={styles.headerAction}>Actions</Text>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      <EditRestaurant
        visible={modalVisible}
        restaurant={selectedRestaurant}
        onClose={() => setModalVisible(false)}
        refreshList={handleUpdateLocal}
      />
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#F9FAFB" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  header: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  headerImage: {
    width: 45,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSmall: { width: 30, fontWeight: "bold" },
  headerText: { flex: 1, fontWeight: "bold" },
  headerAction: {
    width: 130,
    fontWeight: "bold",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 8,
    elevation: 2,
    alignItems: "center",
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
  },

  cellSmall: { width: 30 },
  cell: { flex: 1 },

  actions: {
    width: 130,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  btnText: { color: "white", fontWeight: "bold", fontSize: 12 },
});
