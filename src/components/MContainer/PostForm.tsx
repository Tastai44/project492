import { Avatar, TextField, Divider, Box, Button, Modal } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import * as React from "react";
import CreatePost from "./CreatePost";
import { User } from "../../interface/User";

interface IData {
    inFoUser: User[];
}

export default function PostForm({
    inFoUser,
}: IData) {
    const [openCreatePost, setOpenCreatePost] = React.useState(false);
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
                        src={u.profilePhoto}
                        sx={{ width: "40px", height: "40px", m: 1 }}
                    />
                    <Box style={{ width: "98%" }}>
                        <TextField
                            id="outlined-basic"
                            label="What is in your mind?"
                            variant="outlined"
                            maxRows={4}
                            sx={{ width: "99%" }}
                            onClick={handletOpenCratePost}
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
