
import { getDocs, collection, where, doc, updateDoc, arrayUnion, query, serverTimestamp } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IFriendList, User } from "../../interface/User";
import PopupAlert from "../PopupAlert";

const userInfo = JSON.parse(localStorage.getItem("user") || "null");

const addFriendOtherSide = async (loginUser: User[], userId: string | undefined) => {
    const addFriend: IFriendList[] = loginUser.map((m) => ({
        status: true,
        friendId: userInfo.uid,
        username: m.firstName + m.lastName,
        profilePhoto: m.profilePhoto,
        createdAt: new Date().toLocaleString(),

    }));
    const querySnapshot = await getDocs(
        query(collection(dbFireStore, "users"), where("uid", "==", userId))
    );
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(dbFireStore, "users", userDoc.id);
        updateDoc(userRef, {
            friendList: addFriend,
        })
            .then(() => {
                console.log("Successfully added friend to the friendList.");
            })
            .catch((error) => {
                console.error("Error adding friend to the friendList: ", error);
            });
    }
};
export const handleAddFriend = async (inFoUser: User[], loginUser: User[], userId: string | undefined) => {
    const addFriend: IFriendList[] = inFoUser.map((user) => ({
        status: true,
        friendId: userId ?? "",
        username: `${user.firstName} ${user.lastName}`,
        profilePhoto: user.profilePhoto,
        createdAt: new Date().toLocaleString(),
        dateCreated: serverTimestamp(),
    }));
    const querySnapshot = await getDocs(
        query(collection(dbFireStore, "users"), where("uid", "==", userInfo.uid))
    );
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(dbFireStore, "users", userDoc.id);
        updateDoc(userRef, {
            friendList: arrayUnion(addFriend[0]),
        })
            .then(() => {
                PopupAlert("Successfully added friend to the friendList", "success");
            })
            .catch((error) => {
                console.error("Error adding friend to the friendList: ", error);
            });
        addFriendOtherSide(loginUser, userId);
    }
};

const unFriendOtherSide = async (loginUser: User[], userId: string | undefined, loginUserId: string) => {
    const IndexFriend = loginUser.map((user) => user.friendList?.findIndex((index) => index.friendId === loginUserId)).flat();
    try {
        const q = query(collection(dbFireStore, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        const doc = querySnapshot.docs[0];
        if (doc.exists()) {
            const friendData = { uid: doc.id, ...doc.data() } as User;
            if (friendData.friendList !== undefined) {
                const updateFriend = [...friendData.friendList];
                IndexFriend.forEach((index) => {
                    updateFriend.splice(index ?? 0, 1);
                });
                const updatedData = { ...friendData, friendList: updateFriend };
                await updateDoc(doc.ref, updatedData);
            }
        } else {
            console.log("No post found with the specified ID");
        }
    } catch (error) {
        console.error("Error deleting friend:", error);
    }
};

export const unFriend = async (inFoUser: User[], loginUser: User[], userId: string | undefined) => {
    const IndexFriend = inFoUser.map((user) => user.friendList?.findIndex((index) => index.friendId === userId)).flat();
    try {
        const q = query(collection(dbFireStore, "users"), where("uid", "==", userInfo.uid));
        const querySnapshot = await getDocs(q);

        const doc = querySnapshot.docs[0];
        if (doc.exists()) {
            const friendData = { uid: doc.id, ...doc.data() } as User;
            if (friendData.friendList !== undefined) {
                const updateFriend = [...friendData.friendList];
                IndexFriend.forEach((index) => {
                    updateFriend.splice(index ?? 0, 1);
                });
                const updatedData = { ...friendData, friendList: updateFriend };
                await updateDoc(doc.ref, updatedData);
            }
            unFriendOtherSide(loginUser, userId ? userId : "", userInfo.uid);
            PopupAlert("Unfriend successfully", "success");
        } else {
            console.log("No post found with the specified ID");
        }
    } catch (error) {
        console.error("Error deleting friend:", error);
    }
};