import { Avatar, TextField, Divider, Box, Button, Modal } from '@mui/material'
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Luffy from "../../../public/pictures/Luffy.webp";
import * as React from 'react';
import CreatePost from './CreatePost';

interface IFunction {
  handdleReFresh: () => void;
}

export default function PostForm({handdleReFresh} : IFunction) {
  const [openCreatePost, setOpenCreatePost] = React.useState(false);
  const handletOpenCratePost = () => setOpenCreatePost(true);
  const handleCloseCratePost = () => setOpenCreatePost(false);

  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      <Modal
        open={openCreatePost}
        onClose={handleCloseCratePost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <CreatePost handleCloseCratePost={handleCloseCratePost} handdleReFresh={handdleReFresh}/>
        </Box>
      </Modal>
        <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
          >
            <Avatar
              alt="User"
              src={Luffy}
              sx={{ width: "40px", height: "40px" }}
            />
            <div style={{ width: "98%" }}>
              <TextField
                id="outlined-basic"
                label="What is in your mind?"
                variant="outlined"
                maxRows={4}
                sx={{ width: "99%" }}
                onClick={handletOpenCratePost}
              />
            </div>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              fontSize: "16px",
            }}
          >
            <Button style={{ display: "flex", alignItems: "center", gap: "5px", color:"grey" }}>
              <InsertPhotoIcon sx={{ color: "green" }} /> Photo
            </Button>
            <Button style={{ display: "flex", alignItems: "center", gap: "5px", color:"grey" }}>
              <LocationOnIcon color="error" /> Location
            </Button>
            <Button style={{ display: "flex", alignItems: "center", gap: "5px", color:"grey" }}>
              <EmojiEmotionsIcon sx={{ color: "#FCE205" }} /> Feeling
            </Button>
          </Box>
    </div>
  )
}
