import { useLocalSearchParams } from "expo-router";
import ChatModal from "@/src/components/chatModal";
import {
  GetAdminMessages,
  SendAdminMessage,
} from "../../../../src/api/admin/support";

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams();
  console.log(conversationId,'idd')

  return (
    <ChatModal
      role="admin"
      conversationId={conversationId}
      getMessagesApi={GetAdminMessages}
      sendMessageApi={SendAdminMessage}
    />
  );
}
