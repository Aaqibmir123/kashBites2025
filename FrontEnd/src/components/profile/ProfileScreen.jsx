import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import { BASE_IMAGE_URL } from "@/src/api/constants/endpoints";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/src/api/context/authContext";

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

export default function ProfileScreen({
  getProfileApi,
  updateProfileApi,
  onBack,
}) {
  const { user, updateUser } = useContext(AuthContext);
  const userId = user?._id;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: user?.phone || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= GET PROFILE ================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const p = await getProfileApi({ userId });

      updateUser({
        name: p.name,
        email: p.email,
        image: p?.image,
      });

      setProfile({
        name: p?.name || "",
        email: p?.email || "",
        phone: user?.phone || "",
      });

      if (p?.image) {
        setImageUri(`${BASE_IMAGE_URL}${p.image}`);
      }
    } catch (err) {
      console.log("GET PROFILE ERROR:", err);
    }
  };

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 1,
    });

    if (!result.assets?.length) return;

    setSelectedImage(result.assets[0]);
    setImageUri(result.assets[0].uri);
  };

  /* ================= UPDATE PROFILE (BLOB) ================= */
  const handleUpdate = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", profile.name);
      formData.append("email", profile.email);

      if (selectedImage?.base64) {
        const blob = base64ToBlob(
          selectedImage.base64,
          selectedImage.type || "image/jpeg"
        );

        formData.append("image", blob, "profile.jpg");
      }

      await updateProfileApi(formData);

      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });

      fetchProfile();
    } catch (err) {
      console.log("UPDATE PROFILE ERROR 👉", err);

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                imageUri ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.username}>{profile.name}</Text>
      </View>

      {/* ================= FORM ================= */}
      <View style={styles.form}>
        <TextInput
          value={profile.name}
          onChangeText={(v) => setProfile({ ...profile, name: v })}
          style={styles.input}
          placeholder="Name"
        />

        <TextInput
          value={profile.email}
          onChangeText={(v) => setProfile({ ...profile, email: v })}
          style={styles.input}
          placeholder="Email"
        />

        <TextInput
          value={profile.phone}
          editable={false}
          style={[styles.input, styles.disabled]}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleUpdate}
        >
          <Text style={styles.btnText}>
            {loading ? "Updating..." : "Update Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#E6005C",
    paddingVertical: 45,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  backBtn: { position: "absolute", left: 20, top: 45 },

  avatar: { width: 120, height: 120, borderRadius: 60 },

  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },

  form: { padding: 20 },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  disabled: { backgroundColor: "#eee" },

  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnDisabled: { backgroundColor: "#28a74599" },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
