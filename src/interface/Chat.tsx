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
	conversationId: string;
	content: Conversation[];
	participants: string[];
	createAt: Timestamp;
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
