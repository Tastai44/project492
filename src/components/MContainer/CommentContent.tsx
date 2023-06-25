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
import { dbFireStore } from "../../config/firebase";
import {collection, query, getDocs, where, updateDoc} from "firebase/firestore"
import { Post } from "../../interface/PostContent";

interface IData {
  text: string;
  createAt: string;
  commentIndex: number;
  postId: string;
}

interface IFunction {
  handdleReFresh: () => void;
}

export default function CommentContent({text, createAt, commentIndex, postId, handdleReFresh} : IData & IFunction) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDelete = async (id: string, comId: number) => {
    try {
      const q = query(collection(dbFireStore, 'posts'), where('__name__', '==', id));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      if (doc.exists()) {
        const postData = { id: doc.id, ...doc.data() } as Post;
        const updatedComments = [...postData.comments];
        updatedComments.splice(comId, 1);
        const updatedData = { ...postData, comments: updatedComments };
        await updateDoc(doc.ref, updatedData);
        handdleReFresh();
        handleCloseUserMenu();
      } else {
        console.log('No post found with the specified ID');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Paper sx={{backgroundColor:"primary.contrastText" , mb:1}}>
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
            <MenuItem 
              onClick={() => handleDelete(postId, commentIndex)}
            >
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
