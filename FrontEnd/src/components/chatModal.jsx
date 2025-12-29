import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import TopHeader from "./TopHeader";

/* ================= SYSTEM MESSAGE ================= */
const SYSTEM_MESSAGE = {
  id: "system-1",
  type: "system",
  text:
    "Thank you for contacting us! One of our customer support representatives will connect with you shortly.",
};

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

export default function ChatModal({
  role = "user", // "user" | "admin"
  conversationId,
  getMessagesApi,
  sendMessageApi,
}) {
  const [messages, setMessages] = useState([SYSTEM_MESSAGE]);
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await getMessagesApi(conversationId);
      if (res?.success) {
        const formatted = res.data.map((m) => ({
          id: m._id,
          type: m.senderRole,
          text: m.text,
          images: m.images || [],
          createdAt: m.createdAt,
        }));
        setMessages([SYSTEM_MESSAGE, ...formatted]);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= PICK IMAGES ================= */
  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 0,
    });

    if (result.assets?.length) {
      setSelectedImages((prev) => [...prev, ...result.assets]);
    }
  };

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!message && selectedImages.length === 0) return;

    const formData = new FormData();
    formData.append("conversationId", conversationId);
    if (message) formData.append("text", message);

    selectedImages.forEach((img, i) => {
      const blob = base64ToBlob(
        img.base64,
        img.type || "image/jpeg"
      );
      formData.append("images", blob, `chat-${i}.jpg`);
    });

    const res = await sendMessageApi(formData);

    if (res?.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: role,
          text: message,
          images: selectedImages.map((i) => i.uri),
          createdAt: new Date().toISOString(),
        },
      ]);
      setMessage("");
      setSelectedImages([]);
      setTimeout(() => listRef.current?.scrollToEnd(), 100);
    }
  };

  /* ================= RENDER MESSAGE ================= */
  const renderItem = ({ item }) => {
    if (item.type === "system") {
      return (
        <View style={styles.systemWrap}>
          <View style={styles.systemBubble}>
            <Text style={styles.systemText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    const isMe = item.type === role;

    return (
      <View
        style={[
          styles.msgRow,
          isMe ? styles.rowRight : styles.rowLeft,
        ]}
      >
        <View
          style={[
            styles.msgBubble,
            isMe ? styles.userBubble : styles.adminBubble,
          ]}
        >
          {item.text ? (
            <Text style={styles.msgText}>{item.text}</Text>
          ) : null}

          {item.images?.length > 0 && (
            <ScrollView horizontal>
              {item.images.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={styles.msgImage}
                />
              ))}
            </ScrollView>
          )}

          <Text style={styles.timeText}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D81B60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopHeader title="Live Support" />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 130 }}
      />

      {/* IMAGE PREVIEW */}
      {selectedImages.length > 0 && (
        <ScrollView horizontal style={styles.previewBar}>
          {selectedImages.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img.uri }}
              style={styles.previewImage}
            />
          ))}
        </ScrollView>
      )}

      {/* INPUT BAR */}
      <View style={styles.inputBar}>
        <TouchableOpacity onPress={pickImages}>
          <Ionicons name="image-outline" size={24} />
        </TouchableOpacity>

        <TextInput
          placeholder="Type here..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={22} color="#D81B60" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  systemWrap: { alignItems: "center", marginBottom: 12 },
  systemBubble: {
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 14,
    maxWidth: "90%",
  },
  systemText: { fontSize: 13, color: "#111" },

  msgRow: {
    width: "100%",
    marginVertical: 4,
  },
  rowRight: { alignItems: "flex-end" },
  rowLeft: { alignItems: "flex-start" },

  msgBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#FCE7F3",
    borderTopRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: "#E5E7EB",
    borderTopLeftRadius: 4,
  },

  msgText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#111",
  },

  msgImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginTop: 6,
    marginRight: 6,
  },

  timeText: {
    fontSize: 10,
    color: "#6B7280",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  previewBar: {
    position: "absolute",
    bottom: 70,
    left: 10,
    right: 10,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },

  inputBar: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 30,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
  },
});
