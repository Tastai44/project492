import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Box, Button, Card, CardMedia, IconButton, Modal } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { stylePreviewPhoto } from "../../utils/styleBox";
import CancelIcon from "@mui/icons-material/Cancel";
import {
    collection,
    query,
    getDocs,
    where,
    updateDoc,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { User } from "../../interface/User";
import ProfileInfo from "./ProfileInfo";

export default function ProCoverImage() {
    const { userId } = useParams();
    const [openPre, setOpenPre] = useState(false);
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const handleOpenPre = () => setOpenPre(true);
    const handleClosePre = () => setOpenPre(false);
    const handleClearImage = () => {
        setPreviewImages([]);
        handleClosePre();
    };
    const [reFresh, setReFresh] = useState(0);
    const handleRefresh = () => {
        setReFresh((pre) => pre + 1);
    };
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
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
                    coverPhoto: previewImages[0],
                });
                handleClearImage();
                handleRefresh();
            } else {
                console.log("Profile does not exist");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(
                    collection(dbFireStore, "users"),
                    where("uid", "==", userId)
                );
                const querySnapshot = await getDocs(q);
                const queriedData = querySnapshot.docs.map(
                    (doc) =>
                    ({
                        uid: doc.id,
                        ...doc.data(),
                    } as User)
                );
                setInFoUser(queriedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [userId, reFresh]);

    return (
        <>
            <Modal
                open={openPre}
                onClose={handleClosePre}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={stylePreviewPhoto}>
                    {previewImages.length !== 0 && (
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <IconButton onClick={handleClearImage}>
                                    <CancelIcon sx={{ color: "black" }} />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                {previewImages.map((image, index) => (
                                    <Card key={index} sx={{ width: "50%", height: "auto" }}>
                                        <CardMedia
                                            component="img"
                                            image={image}
                                            alt="Paella dish"
                                        />
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, m: 1 }}>
                        <Button
                            sx={{
                                backgroundColor: "grey",
                                color: "white",
                                "&:hover": {
                                    color: "black",
                                    backgroundColor: "#E1E1E1",
                                },
                            }}
                            onClick={handleClosePre}
                        >
                            Cancel
                        </Button>
                        <Button
                            sx={{
                                backgroundColor: "#8E51E2",
                                color: "white",
                                "&:hover": {
                                    color: "black",
                                    backgroundColor: "#E1E1E1",
                                },
                            }}
                            onClick={handleEditPhotoProfile}
                            type="submit"
                        >
                            Upload
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {inFoUser.map((info) => (
                <Box key={info.uid}>
                    <Card key={info.coverPhoto} sx={{ maxWidth: "100%" }}>
                        <CardMedia sx={{ height: 300 }} image={info.coverPhoto} title="green iguana" />
                    </Card>
                    {userInfo.uid == info.uid && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: "-40px",
                                mr: 0.5,
                                alignItems: "center",
                                alignContent: "center",
                            }}
                        >
                            <Button
                                onClick={handleUploadClick}
                                sx={{
                                    backgroundColor: "white",
                                    color: "black",
                                    "&:hover": {
                                        color: "white",
                                        backgroundColor: "black",
                                    },
                                }}
                                variant="outlined"
                                startIcon={<AddAPhotoIcon />}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    hidden
                                    accept="image/*"
                                />
                                Add cover photo
                            </Button>
                        </Box>
                    )}
                    <ProfileInfo
                        userId={userId ?? ''}
                    />
                </Box>
            ))}
        </>
    );
}
