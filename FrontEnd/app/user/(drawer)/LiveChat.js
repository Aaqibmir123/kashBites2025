import LiveSupportChat from "@/src/components/chatModal";
import {
  GetUserConversation,
  GetUserMessages,
  SendUserMessage,
} from "../../../src/api/user/support";

export default function Support() {
  return (
    <LiveSupportChat
      role="user"
      getConversationApi={GetUserConversation}
      getMessagesApi={GetUserMessages}
      sendMessageApi={SendUserMessage}
    />
  );
}
