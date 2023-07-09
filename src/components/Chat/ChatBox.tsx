// import * as React from 'react'
import Luffy from "../../../public/pictures/Luffy.webp";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styleBoxChat } from "../../utils/styleBox";
import { StyledBadge } from "../RightSide/UserCard";

import CancelIcon from "@mui/icons-material/Cancel";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

interface IFunction{
  handleClose: () => void;
}

export default function ChatBox({handleClose} : IFunction) {
  return (
    <div>
      <Paper sx={styleBoxChat}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              height: "15%",
              display: "flex",
              justifyContent: "space-between",
              pl: 0.5,
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar src={Luffy} sx={{ width: "40px", height: "40px" }} />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ fontSize: "16px", ml: -1 }}>
                    <b>User Name </b>
                  </Box>
                }
                secondary={
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "14px",
                      ml: -1,
                    }}
                  >
                    Active
                  </Typography>
                }
              />
            </ListItem>
            <Box sx={{ p: 0.2 }}>
              <IconButton size="small" onClick={handleClose}>
                <CancelIcon sx={{ color: "white", fontSize: "20px" }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ backgroundColor: "white", height: "70%", display:"flex", flexDirection:"column"}}>
            <Box sx={{display:"flex", justifyContent:"start", m:1}}>
                <Chip color="primary" variant="outlined"  label="User one" />
            </Box>
            <Box sx={{display:"flex", justifyContent:"end", m:1}}>
                <Chip color="primary" label="User two" />
            </Box>
          </Box>
          <Box
            sx={{
              height: "15%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Box>
              <IconButton>
                <CameraAltOutlinedIcon
                  sx={{ color: "primary.main", fontSize: "16px" }}
                />
              </IconButton>
              <IconButton>
                <EmojiEmotionsIcon
                  sx={{ color: "primary.main", fontSize: "16px" }}
                />
              </IconButton>
            </Box>
            <Box>
              <TextField
                size="small"
                name="caption"
                variant="outlined"
                multiline
                maxRows={1}
                sx={{
                  borderRadius:"10px",
                  backgroundColor:"primary.contrastText",
                  overflow:"auto",
                  width: "100%",
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
                // value={post.caption}
                // onChange={handleChangePost}
              />
            </Box>
            <Box>
              <IconButton>
                <SendOutlinedIcon
                  sx={{ color: "primary.main", fontSize: "16px" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
