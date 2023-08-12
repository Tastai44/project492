import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    Avatar,
    IconButton,
    InputLabel,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    TextField,
    MenuItem,
    ImageList,
    ImageListItem,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import emojiData from "emoji-datasource-facebook";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { Post } from "../../interface/PostContent";
import { doc } from "firebase/firestore";
import Emoji from "../MContainer/Emoji";
import { User } from "../../interface/User";
import { collection, query, getDocs, where, setDoc } from "firebase/firestore";
import PopupAlert from "../PopupAlert";

const styleBoxPop = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    color: "black",
    p: 4,
};

interface IHandle {
    handleCloseCratePost: () => void;
}
interface IData {
    groupName: string;
    groupId: string;
}

export default function CreateGroupPost({
    handleCloseCratePost,
    groupName,
    groupId
}: IHandle & IData) {
    const [userId, setUserId] = React.useState("");

    const [status, setStatus] = React.useState("");
    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const [openEmoji, setOpenEmoji] = React.useState(false);
    const handletOpenEmoji = () => setOpenEmoji(true);
    const handleCloseEmoji = () => setOpenEmoji(false);

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = React.useState<string[]>([]);

    React.useEffect(() => {
        const getUerInfo = localStorage.getItem("user");
        const tmp = JSON.parse(getUerInfo ? getUerInfo : "");
        setUserId(tmp.uid);
    }, []);

    const handleClearImage = () => {
        setPreviewImages([]);
    };
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
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
            } catch (error) {
                console.error(error);
            }
        }
    };

    const [emoji, setEmoji] = React.useState("");
    const handleChangeEmoji = (e: string) => {
        setEmoji(e);
    };

    const initialState = {
        id: "",
        caption: "",
        hashTagTopic: "",
        status: "",
        photoPost: [],
        comments: [],
        likes: [],
        createAt: "",
        emoji: "",
        owner: "",
        shareUsers: [],
        reportPost: [],
    };
    const [post, setPost] = React.useState<Post>(initialState);
    const clearState = () => {
        setPost({ ...initialState });
        setStatus("");
        setEmoji("");
        handleClearImage();
    };

    const handleChangePost = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const createPost = async () => {
        const postCollection = collection(dbFireStore, "posts");
        const newPost = {
            id: "",
            caption: post.caption,
            hashTagTopic: post.hashTagTopic,
            status: status,
            photoPost: previewImages,
            likes: [],
            createAt: new Date().toLocaleString(),
            date: new Date().toLocaleDateString("en-US"),
            emoji: emoji,
            owner: userId,
            comments: post.comments,
            groupName: groupName,
            groupId: groupId,
            shareUsers: [],
            reportPost: [],
        };

        try {
            const docRef = doc(postCollection);
            const postId = docRef.id;
            const updatedPost = { ...newPost, id: postId };
            await setDoc(docRef, updatedPost);

            setPost(updatedPost);
            clearState();
            PopupAlert("Content was posted successfully", "success");
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
        const emoji = emojiData.find((data) => data.unified === emojiCode);
        return emoji ? emoji.name : undefined;
    };

    const [inFoUser, setInFoUser] = React.useState<User[]>([]);
    React.useEffect(() => {
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
    }, [userId]);

    return (
        <div>
            <Modal
                open={openEmoji}
                onClose={handleCloseEmoji}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Emoji
                        handleClose={handleCloseEmoji}
                        handleChangeEmoji={handleChangeEmoji}
                    />
                </Box>
            </Modal>
            <Box sx={styleBoxPop}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                        id="modal-modal-title"
                        sx={{ fontSize: "25px", fontWeight: "500" }}
                    >
                        Create A Post
                    </Box>
                    <Box>
                        <IconButton onClick={handleCloseCratePost}>
                            <CancelIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box>
                    {inFoUser.map((u) => (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar
                                    src={u.profilePhoto}
                                    sx={{ width: "40px", height: "40px", marginRight: "10px" }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ fontSize: "16px" }}>
                                        <Box sx={{ mb: 1 }}>
                                            <b>{u.username} </b>
                                            {emoji !== "" && (
                                                <>
                                                    {String.fromCodePoint(parseInt(emoji, 16))}{" "}
                                                    {convertEmojiCodeToName(emoji)}
                                                </>
                                            )}
                                        </Box>
                                        <FormControl size="small" sx={{ width: "130px" }}>
                                            <InputLabel id="demo-simple-select">Status</InputLabel>
                                            <Select
                                                label="Status"
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={status}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"Private"}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignContent: "end",
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <LockIcon /> Private
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value={"Public"}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignContent: "end",
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <PublicIcon /> Public
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                    <TextField
                        name="caption"
                        label="What is in your mind?"
                        variant="outlined"
                        multiline
                        maxRows={4}
                        sx={{
                            width: "99%",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: "transparent",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "transparent",
                                },
                            },
                        }}
                        value={post.caption}
                        onChange={handleChangePost}
                    />
                    <TextField
                        name="hashTagTopic"
                        id="outlined-basic"
                        label="#hashtag"
                        variant="outlined"
                        maxRows={4}
                        sx={{
                            width: "99%",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: "transparent",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "transparent",
                                },
                            },
                        }}
                        value={post.hashTagTopic}
                        onChange={handleChangePost}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Box onClick={handleUploadClick}>
                                <IconButton size="large">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        multiple
                                        hidden
                                    />
                                    <InsertPhotoIcon sx={{ color: "green" }} />
                                </IconButton>
                            </Box>
                            <IconButton size="large">
                                <LocationOnIcon color="error" />
                            </IconButton>
                            <IconButton onClick={handletOpenEmoji} size="large">
                                <EmojiEmotionsIcon sx={{ color: "#FCE205" }} />
                            </IconButton>
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={createPost}
                                sx={{
                                    backgroundColor: "#8E51E2",
                                    color: "white",
                                    "&:hover": {
                                        color: "black",
                                        backgroundColor: "#E1E1E1",
                                    },
                                }}
                                type="submit"
                            >
                                Post
                            </Button>
                        </Box>
                    </Box>
                    {previewImages.length !== 0 && (
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <IconButton onClick={handleClearImage}>
                                    <CancelIcon />
                                </IconButton>
                            </Box>
                            <ImageList
                                sx={{ width: "100%", height: "auto", maxHeight: "500px" }}
                                cols={3}
                                rowHeight={164}
                            >
                                {previewImages.map((image, index) => (
                                    <ImageListItem key={index}>
                                        <img src={image} alt={`Preview ${index}`} loading="lazy" />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
}
