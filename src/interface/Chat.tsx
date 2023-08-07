export interface Conversation {
  _id: string;
  participants: string[];
  created_at: string;
}

export interface Message {
  _id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  photoMessage: string[];
  emoji: string;
  timestamp: string;
}

export interface Chat {
  chatId: string;
  senderId: string;
  receiverId: string;
  senderMessage: {
    message: string;
    createAt: string;
  }[];
  receiverMessage: {
    message: string;
    createAt: string;
  }[];
}
