import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Avatar, Paper, Box, Button, Modal, Badge, IconButton } from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { User } from "../../interface/User";
import EditProfile from "./EditProfile";
import { collection, where, onSnapshot, query, getDocs, updateDoc } from "firebase/firestore";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { dbFireStore, storage } from "../../config/firebase";
import PopupAlert from "../PopupAlert";
import UploadProfile from "./UploadProfile";
import { useParams } from "react-router-dom";
import { ref, uploadBytes, listAll, getDownloadURL, StorageReference } from "firebase/storage";
import heic2any from "heic2any";
import Loading from "../Loading";
import { validExtensions } from "../../helper/ImageLastName";
import { resizeImage } from "../Functions/ResizeImage";
import { handleAddFriend } from "../Functions/AddUnFriend";

interface IData {
    userId: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const removeSpacesBetweenWords = (inputString: string) => {
    return inputString.replace(/\s+/g, '');
};

export default function ProfileInfo(props: IData) {
    const [open, setOpen] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [loginUser, setLoginUser] = useState<User[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [openPre, setOpenPre] = useState(false);
    const { userId } = useParams();
    const [previewImages, setPreviewImages] = useState<string>('');
    const [openLoading, setLopenLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [reFresh, setReFresh] = useState(0);

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
    }, [props.userId, reFresh]);

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
    }, [userInfo.uid, reFresh]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const listRef: StorageReference = ref(storage, '/Images');
                const res = await listAll(listRef);
                const urls = await Promise.all(
                    res.items.map(async (itemRef) => {
                        const imageUrl = await getDownloadURL(itemRef);
                        return imageUrl;
                    })
                );
                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchImages();
    }, [reFresh]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenPre = () => setOpenPre(true);
    const handleClosePre = () => setOpenPre(false);

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

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpload = async () => {
        setLopenLoading(true);
        if (imageUpload == null) return;
        const resizedImage = await resizeImage(imageUpload, 800, 600);
        const fileName = removeSpacesBetweenWords(imageUpload.name);
        const imageRef = ref(storage, `Images/${userId}${fileName}`);
        uploadBytes(imageRef, resizedImage).then(() => {
            handleEditPhotoProfile(`${userId}${imageUpload.name}`);
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const fileName = fileInput.value;
        const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        const reader = new FileReader();
        const isExtensionValid = validExtensions.includes(fileNameExt.toLowerCase());

        if (fileNameExt === 'heic' || fileNameExt === 'HEIC') {
            const blob = fileInput.files?.[0];
            try {
                if (blob) {
                    const resultBlob = await heic2any({ blob, toType: 'image/jpg' }) as BlobPart;
                    const file = new File([resultBlob], `${event.target.files?.[0].name.split('.')[0]}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: new Date().getTime(),
                    });
                    setImageUpload(file);
                    reader.onloadend = () => {
                        setPreviewImages(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                    handleOpenPre();
                }
            } catch (error) {
                console.error(error);
            }
        } else if (isExtensionValid) {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) {
                reader.onloadend = () => {
                    setPreviewImages(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
                handleOpenPre();
                setImageUpload(selectedFile);
            }
        } else {
            PopupAlert("Sorry, this website can only upload picture", "warning");
        }
    };

    const handleClearImage = () => {
        setPreviewImages('');
        handleClosePre();
    };

    const handleEditPhotoProfile = async (picPatch: string) => {
        try {
            const q = query(
                collection(dbFireStore, "users"),
                where("uid", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];

            if (doc.exists()) {
                await updateDoc(doc.ref, {
                    profilePhoto: removeSpacesBetweenWords(picPatch),
                });
                handleClearImage();
                setReFresh(pre => pre + 1);
                PopupAlert("Upload photo successfully", "success");
                setLopenLoading(false);
            } else {
                console.log("Profile does not exist");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    return (
        <>
            <Loading
                openLoading={openLoading}
            />
            <UploadProfile
                openPre={openPre}
                previewImages={previewImages}
                handleClearImage={handleClearImage}
                handleClosePre={handleClosePre}
                handleUpload={handleUpload}
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
                        borderRadius: "10px"
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
                                                accept="*"
                                            />
                                            <AddAPhotoIcon style={{ fontSize: "10px" }} />
                                        </IconButton>
                                    )}
                                </Box>
                            }
                        >
                            <Avatar src={imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))} />
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
                            onClick={() => handleAddFriend(userId, userInfo.uid)}
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
