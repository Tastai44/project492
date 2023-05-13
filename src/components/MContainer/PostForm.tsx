import { Avatar, TextField, Divider, Box } from '@mui/material'
import React from 'react'
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function PostForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
              sx={{ width: "50px", height: "50px" }}
            />
            <div>
              <TextField
                id="outlined-basic"
                label="What is in your mind?"
                variant="outlined"
                multiline
                maxRows={4}
                sx={{ width: "90vh" }}
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
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <InsertPhotoIcon sx={{ color: "green" }} /> Photo
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <LocationOnIcon color="error" /> Location
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <EmojiEmotionsIcon sx={{ color: "#ffff00" }} /> Feeling
            </div>
          </Box>
    </div>
  )
}
