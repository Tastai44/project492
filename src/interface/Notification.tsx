export interface INoti {
    notiId: string;
    contentId: string;
    actionMessage: string;
    actionBy: string;
    actionTo?: string;
    createAt: string;
}

export interface IMessageNoti {
    notiId: string;
    conversationId: string;
    message: string;
    senderId: string;
    receiverId: string;
    createAt: string;
}

export interface IGroupMessageNoti {
    notiId: string;
    conversationId: string;
    message: string;
    senderId: string;
    groupId: string;
    createAt: string;
}