import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Box, Button, Card, CardMedia } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { storage } from '../../config/firebase';
import {
    collection,
    query,
    getDocs,
    where,
    updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL, StorageReference } from "firebase/storage";
import { dbFireStore } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { User } from "../../interface/User";
import ProfileInfo, { removeSpacesBetweenWords } from "./ProfileInfo";
import heic2any from 'heic2any';
import Loading from "../Loading";
import UploadProfile from "./UploadProfile";
import { resizeImage } from "../Functions/ResizeImage";
import PopupAlert from "../PopupAlert";
import { validExtensions } from "../../helper/ImageLastName";

export default function ProCoverImage() {
    const { userId } = useParams();
    const [openPre, setOpenPre] = useState(false);
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [reFresh, setReFresh] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = useState<string>('');
    const [openLoading, setLopenLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

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

    const handleUpload = async (): Promise<void> => {
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
        setLopenLoading(true);
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
                    setLopenLoading(false);
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
                setLopenLoading(false);
                handleOpenPre();
                setImageUpload(selectedFile);
            }
        } else {
            PopupAlert("Sorry, this website can only upload picture", "warning");
        }
    };

    const handleOpenPre = () => setOpenPre(true);
    const handleClosePre = () => setOpenPre(false);
    const handleClearImage = () => {
        setPreviewImages('');
        handleClosePre();
    };

    const handleRefresh = () => {
        setReFresh((pre) => pre + 1);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
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
                    coverPhoto: removeSpacesBetweenWords(picPatch),
                });
                handleClearImage();
                handleRefresh();
                handleClosePre();
                PopupAlert("Upload picture successfully", "success");
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
            {inFoUser.map((info, index) => (
                <Box key={index}>
                    {imageUrls.length !== 0 && (
                        <Card sx={{ maxWidth: "100%", borderRadius: "10px" }}>
                            <CardMedia sx={{ height: 300 }} image={imageUrls.find((item) => item.includes(info.coverPhoto ?? ""))} title="green iguana" />
                        </Card>
                    )}
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
                                    borderRadius: "5px",
                                    "&:hover": {
                                        color: "white",
                                        backgroundColor: "black",
                                        border: "0px"
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
                                    accept="*"
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
