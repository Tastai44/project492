import { collection, setDoc, doc } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";

export const createNoti = async (
    contentId: string, actionMessage: string, actionBy: string, actionTo?: string,
) => {
    const notiCollection = collection(dbFireStore, "notifications");
    const newNoti = {
        notiId: "",
        contentId: contentId,
        actionMessage: actionMessage,
        actionBy: actionBy,
        actionTo: actionTo ?? "",
        isRead: false,
        createAt: new Date().toLocaleString(),
    };

    try {
        const docRef = doc(notiCollection);
        const notiId = docRef.id;
        const addNotification = { ...newNoti, notiId: notiId };
        await setDoc(docRef, addNotification);
    } catch (error) {
        console.error("Error adding post: ", error);
    }
};