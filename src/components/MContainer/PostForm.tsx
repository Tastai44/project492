import { useEffect, useState } from "react";
import { Avatar, TextField, Divider, Box, Button, Modal } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CreatePost from "./CreatePost";
import { User } from "../../interface/User";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

interface IData {
    inFoUser: User[];
}

export default function PostForm({
    inFoUser,
}: IData) {
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

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
    }, []);

    const handletOpenCratePost = () => setOpenCreatePost(true);
    const handleCloseCratePost = () => setOpenCreatePost(false);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Modal
                open={openCreatePost}
                onClose={handleCloseCratePost}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <CreatePost
                        handleCloseCratePost={handleCloseCratePost}
                    />
                </Box>
            </Modal>
            {inFoUser.map((u) => (
                <Box
                    key={u.uid}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginBottom: 10,
                    }}
                >
                    <Avatar
                        alt="User"
                        src={imageUrls.find((item) => item.includes(u.profilePhoto ?? ""))}
                        sx={{ width: "40px", height: "40px", m: 1 }}
                    />
                    <Box style={{ width: "98%" }}>
                        <TextField
                            id="outlined-basic"
                            label="What is in your mind?"
                            variant="outlined"
                            maxRows={4}
                            sx={{
                                width: "99%", '& fieldset': {
                                    borderRadius: '20px',
                                },
                            }}
                            onClick={handletOpenCratePost}
                            size="small"
                        />
                    </Box>
                </Box>
            ))}
            <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    fontSize: "16px",
                }}
            >
                <Button
                    onClick={handletOpenCratePost}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "grey",
                    }}
                >
                    <InsertPhotoIcon sx={{ color: "green" }} /> Photo
                </Button>
                <Button
                    onClick={handletOpenCratePost}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "grey",
                    }}
                >
                    <LocationOnIcon color="error" /> Location
                </Button>
                <Button
                    onClick={handletOpenCratePost}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "grey",
                    }}
                >
                    <EmojiEmotionsIcon sx={{ color: "#FCE205" }} /> Feeling
                </Button>
            </Box>
        </Box>
    );
}
