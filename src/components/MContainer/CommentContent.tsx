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
  Modal,
  Button,
  TextField,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
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

const styleBoxPop = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  color: "black",
  p: 3,
  overflow: "auto",
};

export default function CommentContent({
  text,
  createAt,
  commentIndex,
  postId,
  handdleReFresh,
}: IData & IFunction) {
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
      const q = query(
        collection(dbFireStore, "posts"),
        where("__name__", "==", id)
      );
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
        console.log("No post found with the specified ID");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const [openEditCom, setOpenEditCom] = React.useState(false);
  const handletOpenEditCom = () => {
    handleCloseUserMenu();
    setOpenEditCom(true);
  };
  const handleCloseEditCom = () => setOpenEditCom(false);

  return (
    <Box>
      <Modal
        open={openEditCom}
        onClose={handleCloseEditCom}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Paper sx={styleBoxPop}>
            <Typography sx={{ fontSize: "30px" }}>Edit Comment</Typography>
            <Box sx={{ width: "98%", display: "flex", flexDirection:"column",gap: 1 }}>
              <TextField
                name="text"
                size="small"
                id="outlined-basic"
                label="Comment something..."
                variant="outlined"
                multiline
                maxRows={4}
                sx={{ width: "100%" }}
                // value={comment.text}
                // onChange={handleChangeComment}
              />
              <Box sx={{display:"flex", justifyContent:"flex-end", gap:1}}>
              <Button
                size="small"
                variant="contained"
                // onClick={postComment}
                sx={{
                  backgroundColor: "primary.contrastText",
                  color: "black",
                  "&:hover": {
                    color: "black",
                    backgroundColor: "#8E51E2",
                  },
                  maxHeight: "40px",
                }}
                onClick={handleCloseEditCom}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                // onClick={postComment}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    color: "black",
                    backgroundColor: "#E1E1E1",
                  },
                  maxHeight: "40px",
                }}
                type="submit"
              >
                Save
              </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Modal>
      <Paper sx={{ backgroundColor: "primary.contrastText", mb: 1 }}>
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
              <MenuItem onClick={handletOpenEditCom}>
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
              <MenuItem onClick={() => handleDelete(postId, commentIndex)}>
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
        <Box sx={{ ml: 1, pb: 1 }}>{text}</Box>
      </Paper>
    </Box>
  );
}
