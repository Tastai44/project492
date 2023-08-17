import { Timestamp } from "firebase/firestore";

export interface Conversation {
	message: string,
	photoMessage: string[],
	emoji: string,
	senderId: string;
	receiverId: string;
}

export interface Message {
	conversationId: string;
	senderId: string;
	content: Conversation[];
	participants: string[];
	createAt: Timestamp;
	timestamp: string;
}
export interface GroupMessage {
	_id: string;
	conversation_id: string;
	sender_id: string;
	ownerContent_id: string;
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
