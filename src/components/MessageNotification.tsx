import { collection, doc, setDoc } from 'firebase/firestore';
import { dbFireStore } from '../config/firebase';

export const createMessageNoti = async (
    conversationId: string, senderId: string, receiverId: string, message: string
) => {
    const notiCollection = collection(dbFireStore, "messageNotifications");
    const newMessageNoti = {
        notiId: "",
        conversationId: conversationId,
        message: message,
        senderId: senderId,
        receiverId: receiverId ?? "",
        createAt: new Date().toLocaleString(),
    };
    try {
        const docRef = doc(notiCollection);
        const notiId = docRef.id;
        const addNotification = { ...newMessageNoti, notiId: notiId };
        await setDoc(docRef, addNotification);
    } catch (error) {
        console.error("Error adding post: ", error);
    }
};
