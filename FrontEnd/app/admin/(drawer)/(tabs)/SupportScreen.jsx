import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import TopHeader from "@/src/components/TopHeader";
import { GetAdminConversations } from "@/src/api/admin/support";

export default function SupportScreen() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await GetAdminConversations();
      if (res?.success) setList(res.data);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "../Support/chat",
          params: { conversationId: item._id },
        })
      }
    >
      <Text style={styles.phone}>
        {item.user?.phone || "Unknown User"}
      </Text>

      <Text style={styles.lastMsg} numberOfLines={1}>
        {item.lastMessage || "No message yet"}
      </Text>

      {item.unreadCount > 0 && (
        <Text style={styles.unread}>
          Unread: {item.unreadCount}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopHeader title="Support Chats" />

      {loading ? (
        <ActivityIndicator size="large" color="#D81B60" />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  phone: { fontSize: 15, fontWeight: "700" },
  lastMsg: { color: "#6B7280", marginTop: 4 },
  unread: { color: "#D81B60", marginTop: 4 },
});
