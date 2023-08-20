import { Timestamp } from "firebase/firestore";

export interface INoti {
    notiId: string;
    contentId: string;
    actionMessage: string;
    actionBy: string;
    actionTo?: string;
    isRead: boolean;
    status: string;
    dateCreated: string;
    createAt: Timestamp;
}

export interface IMessageNoti {
    notiId: string;
    conversationId: string;
    message: string;
    senderId: string,
    receiverId: string,
    dateCreated: string;
    isRead: boolean;
    createAt: Timestamp;
}

export interface IGroupMessageNoti {
    notiId: string;
    conversationId: string;
    message: string;
    senderId: string,
    groupId: string,
    receiverId: string[],
    dateCreated: string;
    isRead: boolean;
    createAt: Timestamp;
}