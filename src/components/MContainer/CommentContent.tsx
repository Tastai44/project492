import * as React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import "firebase/database";
import { db } from "../../config/firebase";
import { ref, push, get, update, remove, set } from "firebase/database";

interface IData {
  text: string;
  createAt: string;
  commentId: string;
  postId: string;
}

export default function CommentContent({text, createAt, commentId, postId} : IData) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handdleDelete = (id: string, comId: string) => {
    const postRef = ref(db, "/posts");
    get(postRef)
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          if (post.id === id) {
            const comments = post.comments;
            for (let i = 0; i < post.comments.length; i++) {
              if (post.comments[i].id === comId) {
                const postKey = childSnapshot.key;
                const postToDeleteRef = ref(db, `/posts/${postKey}`);
                comments.splice(i, 1);
                set(postToDeleteRef, post)
                  .then(() => {
                    alert("Comment deleted successfully");
                    handleCloseUserMenu();
                    // handleRefresh(); 
                  })
                  .catch((error) => {
                    console.error("Error deleting comment:", error);
                  });
                break; 
              }
            }
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  return (
    <Paper sx={{backgroundColor:"primary.contrastText" , mb:3}}>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={Luffy} sx={{ width: "40px", height: "40px" }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ fontSize: "16px" }}>
              <b>User Name</b>
            </Box>
          }
          secondary={
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "12px",
              }}
            >
              {createAt}
            </Typography>
          }
        />
        <ListItemAvatar>
          <IconButton onClick={handleOpenUserMenu}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            sx={{ mt: "30px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography
                textAlign="center"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "start",
                  fontSize: "18px",
                }}
              >
                <BorderColorOutlinedIcon /> Edit
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handdleDelete(postId, commentId)}>
              <Typography
                textAlign="center"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "start",
                  fontSize: "18px",
                }}
              >
                <DeleteOutlineOutlinedIcon /> Delete
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography
                textAlign="center"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "start",
                  fontSize: "18px",
                }}
              >
                <FlagOutlinedIcon /> Report
              </Typography>
            </MenuItem>
          </Menu>
        </ListItemAvatar>
      </ListItem>
      <Box sx={{ ml:1, pb:1}}>
        {text}
      </Box>
    </Paper>
  );
}
