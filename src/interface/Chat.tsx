export interface Conversation {
    // conversationId: string;
    // participants: {
    //     userOne: string;
    //     userTwo: string;
    // }[];
    // createAt: string;
    _id: string;
  participants: string[];
  created_at: string;
}

export interface Message {
    // messageId: string;
    // conversationId: string;
    // senderId: string;
    // receiverId: string;
    // content: string;
    // createAt: string;
    _id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
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