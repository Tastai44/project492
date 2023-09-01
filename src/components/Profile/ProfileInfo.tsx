import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Avatar, Paper, Box, Button, Modal, Badge, IconButton } from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { IFriendList, User } from "../../interface/User";
import EditProfile from "./EditProfile";
import { collection, where, onSnapshot, query, getDocs, updateDoc, arrayUnion, doc } from "firebase/firestore";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { dbFireStore } from "../../config/firebase";
import PopupAlert from "../PopupAlert";
import UploadProfile from "./UploadProfile";
import { useParams } from "react-router-dom";

interface IData {
    userId: string;
}

export default function ProfileInfo(props: IData) {
    const [open, setOpen] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [loginUser, setLoginUser] = useState<User[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [openPre, setOpenPre] = useState(false);
    const { userId } = useParams();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenPre = () => setOpenPre(true);
    const handleClosePre = () => setOpenPre(false);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files) {
            try {
                const selectedFiles = Array.from(files);
                const readerPromises = selectedFiles.map((file) => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result as string);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });

                const base64Images = await Promise.all(readerPromises);
                setPreviewImages(base64Images);
                handleOpenPre();
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleClearImage = () => {
        setPreviewImages([]);
        handleClosePre();
    };

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", props.userId)
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
    }, [props.userId]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", userInfo.uid)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setLoginUser(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [userInfo.uid]);

    const unFriendOtherSide = async (id: string) => {
        const IndexFriend = loginUser.map((user) => user.friendList?.findIndex((index) => index.friendId === id)).flat();
        try {
            const q = query(collection(dbFireStore, "users"), where("uid", "==", props.userId));
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

    const unFriend = async (id: string) => {
        const IndexFriend = inFoUser.map((user) => user.friendList?.findIndex((index) => index.friendId === id)).flat();
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
                unFriendOtherSide(props.userId ? props.userId : "");
                PopupAlert("Unfriend successfully", "success");
            } else {
                console.log("No post found with the specified ID");
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };

    const addFriendOtherSide = async () => {
        const addFriend: IFriendList[] = loginUser.map((m) => ({
            status: true,
            friendId: userInfo.uid,
            username: m.firstName + m.lastName,
            profilePhoto: m.profilePhoto,
            createdAt: new Date().toLocaleString(),
        }));
        const querySnapshot = await getDocs(
            query(collection(dbFireStore, "users"), where("uid", "==", props.userId))
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
    const handleAddFriend = async () => {
        const addFriend: IFriendList[] = inFoUser.map((user) => ({
            status: true,
            friendId: props.userId ?? "",
            username: `${user.firstName} ${user.lastName}`,
            profilePhoto: user.profilePhoto,
            createdAt: new Date().toLocaleString(),
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
            addFriendOtherSide();
        }
    };

    const handleEditPhotoProfile = async () => {
        try {
            const q = query(
                collection(dbFireStore, "users"),
                where("uid", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];

            if (doc.exists()) {
                await updateDoc(doc.ref, {
                    profilePhoto: previewImages[0],
                });
                handleClearImage();
            } else {
                console.log("Profile does not exist");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    return (
        <>
            <UploadProfile
                openPre={openPre}
                previewImages={previewImages}
                handleClearImage={handleClearImage}
                handleClosePre={handleClosePre}
                handleEditPhotoProfile={handleEditPhotoProfile}
            />
            {inFoUser.map((user) => (
                <Paper
                    key={user.uid}
                    sx={{
                        mt: 5,
                        display: { xs: "flex", lg: "none" },
                        alignItems: "center",
                        p: 2,
                        mr: 1,
                        ml: 1,
                        justifyContent: "space-between",
                    }}
                >
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box>
                            <EditProfile
                                closeEdit={handleClose}
                                userId={user.uid}
                                username={user.username}
                                firstName={user.firstName}
                                lastName={user.lastName}
                                email={user.email}
                                aboutMe={user.aboutMe}
                                faculty={user.faculty}
                                instagram={user.instagram}
                                statusDefault={user.status}
                                yearDefault={user.year}
                            />
                        </Box>
                    </Modal>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={
                                <Box onClick={handleUploadClick}>
                                    {user.uid == userInfo.uid && (
                                        <IconButton
                                            sx={{
                                                backgroundColor: "white",
                                                height: "10px",
                                                width: "10px",
                                                "&:hover": {
                                                    color: "white",
                                                    backgroundColor: "black",
                                                },
                                            }}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                multiple
                                                hidden
                                                accept="image/*"
                                            />
                                            <AddAPhotoIcon style={{ fontSize: "10px" }} />
                                        </IconButton>
                                    )}

                                </Box>
                            }
                        >
                            <Avatar src={user.profilePhoto} />
                        </Badge>
                        <Box sx={{ fontSize: "20px" }}>
                            {`${user.firstName} ${user.lastName}`}{" "}
                        </Box>
                    </Box>
                    {userInfo.uid == user.uid ? (
                        <Button
                            size="small"
                            sx={{
                                width: "30px",
                                fontSize: "16px",
                                alignItems: "center",
                                backgroundColor: "#8E51E2",
                                color: "white",
                                "&:hover": {
                                    color: "black",
                                    backgroundColor: "white",
                                },
                            }}
                            startIcon={<BorderColorOutlinedIcon sx={{ width: "16px" }} />}
                            onClick={handleOpen}
                        >
                            Edit
                        </Button>
                    ) : (user.friendList?.some((friend) => friend.friendId === userInfo.uid)) ? (
                        <Button
                            onClick={() => unFriend(props.userId ?? "")}
                            size="small"
                            sx={{
                                width: "100px",
                                backgroundColor: "#8E51E2",
                                color: "white",
                                "&:hover": {
                                    color: "black",
                                    backgroundColor: "white",
                                },
                            }}
                        >
                            UnFriend
                        </Button>
                    ) : (
                        <Button
                            onClick={handleAddFriend}
                            size="small"
                            sx={{
                                width: "100px",
                                backgroundColor: "#8E51E2",
                                color: "white",
                                "&:hover": {
                                    color: "black",
                                    backgroundColor: "white",
                                },
                            }}
                        >
                            Add Friend
                        </Button>
                    )}
                </Paper>
            ))}
        </>
    );
}
