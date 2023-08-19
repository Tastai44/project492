import { collection, doc, serverTimestamp, setDoc, getDocs, updateDoc } from 'firebase/firestore';
import { dbFireStore } from '../config/firebase';

export const createMessageNoti = async (
    conversationId: string, senderId: string, receiverId: string, message: string
) => {
    const messageNotiCollection = collection(dbFireStore, "messageNotifications");
    const querySnapshot = await getDocs(messageNotiCollection);
    let notiId = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
            (data.receiverId === receiverId && data.senderId == senderId)
        ) {
            notiId = data.notiId;
        }
    });

    const newMessageNoti = {
        conversationId: conversationId,
        message: message,
        senderId: senderId,
        receiverId: receiverId,
        isRead: false,
        dateCreated: new Date().toLocaleString(),
        createAt: serverTimestamp(),
    };
    try {
        if (notiId) {
            const notiDocRef = doc(messageNotiCollection, notiId);
            await updateDoc(notiDocRef, {
                isRead: false,
                message: message,
            });
        } else {
            const docRef = doc(messageNotiCollection);
            notiId = docRef.id;
            const updatedMessage = {
                ...newMessageNoti,
                notiId: notiId,
            };
            await setDoc(docRef, updatedMessage);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

export const createGroupMessageNoti = async (
    conversationId: string, senderId: string, groupId: string, members: string[], message: string
) => {
    const messageNotiCollection = collection(dbFireStore, "groupMessageNotications");
    const querySnapshot = await getDocs(messageNotiCollection);
    let notiId = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
            (data.receiverId === groupId && data.senderId == senderId)
        ) {
            notiId = data.notiId;
        }
    });

    const newMessageNoti = {
        conversationId: conversationId,
        message: message,
        senderId: senderId,
        groupId: groupId,
        receiverId: members,
        isRead: false,
        dateCreated: new Date().toLocaleString(),
        createAt: serverTimestamp(),
    };
    try {
        if (notiId) {
            const notiDocRef = doc(messageNotiCollection, notiId);
            await updateDoc(notiDocRef, {
                isRead: false,
                message: message,
            });
        } else {
            const docRef = doc(messageNotiCollection);
            notiId = docRef.id;
            const updatedMessage = {
                ...newMessageNoti,
                notiId: notiId,
            };
            await setDoc(docRef, updatedMessage);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }

}

