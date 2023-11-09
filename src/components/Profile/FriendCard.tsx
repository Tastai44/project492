import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import "firebase/database";
import {
    collection,
    query,
    getDocs,
    updateDoc,
    where,
    onSnapshot,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IFriendList, User } from "../../interface/User";
import PopupAlert from "../PopupAlert";

interface IData {
    username: string;
    profilePhoto?: string;
    uid: string;
    friendList: IFriendList[];
}

export default function FriendCard(props: IData) {
    const { userId } = useParams();
    const [inFoUser, setInFoUser] = useState<User[]>([]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", props.uid)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setInFoUser(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [props.uid]);

    const unFriendOtherSide = async (id: string) => {
        const IndexFriend = props.friendList.findIndex((index) => index.friendId === id);
        try {
            const q = query(collection(dbFireStore, "users"), where("uid", "==", props.uid));
            const querySnapshot = await getDocs(q);

            const doc = querySnapshot.docs[0];
            if (doc.exists()) {
                const friendData = { uid: doc.id, ...doc.data() } as User;
                if (friendData.friendList !== undefined) {
                    const updateFriend = [...friendData.friendList];
                    updateFriend.splice(IndexFriend, 1);
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

    const unFriend = async (id: string) => {
        const IndexFriend = props.friendList.findIndex((index) => index.friendId === id);
        try {
            const q = query(collection(dbFireStore, "users"), where("uid", "==", userId));
            const querySnapshot = await getDocs(q);

            const doc = querySnapshot.docs[0];
            if (doc.exists()) {
                const friendData = { uid: doc.id, ...doc.data() } as User;
                if (friendData.friendList !== undefined) {
                    const updateFriend = [...friendData.friendList];
                    updateFriend.splice(IndexFriend, 1);
                    const updatedData = { ...friendData, friendList: updateFriend };
                    await updateDoc(doc.ref, updatedData);
                }
                unFriendOtherSide(userId ? userId : "");
                PopupAlert("Unfriend successfully", "success");
            } else {
                console.log("No post found with the specified ID");
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };

    return (
        <>
            {inFoUser.map((user) => (
                <Card
                    key={user.uid}
                    sx={{
                        width: 210,
                        background: "linear-gradient(to bottom, #000000, #CECCCC8A)",
                        margin: "10px",
                        borderRadius: "20px"
                    }}
                >
                    <CardMedia
                        component="img"
                        height="184"
                        image={user.profilePhoto}
                        alt="userPicture"
                    />
                    <CardContent>
                        <Typography variant="body2" color="white" sx={{ fontSize: "20px", textAlign: "center" }}>
                            {`${user.firstName} ${user.lastName}`}
                        </Typography>
                    </CardContent>
                    <CardActions
                        disableSpacing
                        sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                        <NavLink to={`/profileBlog/${props.uid}`}>
                            <Button
                                sx={{
                                    color: "white",
                                    borderRadius: "5px",
                                    backgroundColor: "#920EFA",
                                    "&:hover": { backgroundColor: "white", color: "black" },
                                }}
                            >
                                View
                            </Button>
                        </NavLink>
                        <Button
                            sx={{
                                color: "white",
                                borderRadius: "5px",
                                backgroundColor: "grey",
                                "&:hover": { backgroundColor: "white", color: "black" },
                            }}
                            onClick={() => unFriend(props.uid)}
                        >
                            UnFriend
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </>
    );
}
