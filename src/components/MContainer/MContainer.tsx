import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Divider,
  ImageList,
  ImageListItem,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  Typography,
  MenuItem,
  IconButton,
  Modal,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";

import TextField from "@mui/material/TextField";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CommentIcon from "@mui/icons-material/Comment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import emojiData from "emoji-datasource-facebook";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Content from "./Content";

import "firebase/database";
import { db } from "../../config/firebase";
import { ref, get, remove } from "firebase/database";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface data {
  caption: string;
  hashTagTopic: string;
  status: string;
  createAt: string;
  photoPost: string[];
  emoji?: string;
  likeNumber: number;
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
  width: "100%",
  height:"100%",
  bgcolor: "background.paper",
  color: "black",
  p: 4,
  overflow:"auto"
};

export default function MContainer({
  caption,
  hashTagTopic,
  status,
  createAt,
  emoji,
  photoPost,
  likeNumber,
  postId,
  handdleReFresh
}: data & IFunction) {
  const [iconStatus, setIconStatus] = React.useState("");
  React.useEffect(() => {
    if (status === "Private") {
      setIconStatus("LockIcon");
    } else if (status === "Friend") {
      setIconStatus("GroupIcon");
    } else if (status === "Public") {
      setIconStatus("PublicIcon");
    }
  }, [iconStatus, status]);

  const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
    const emoji = emojiData.find((data) => data.unified === emojiCode);
    return emoji ? emoji.name : undefined;
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [openPost, setOpenPost] = React.useState(false);
  const handletOpenPost = () => setOpenPost(true);
  const handleClosePost = () => setOpenPost(false);

  const [userId, setUserId] = React.useState("");
  React.useEffect (() => {
    const getUerInfo = localStorage.getItem("user");
    const tmp = JSON.parse(getUerInfo ? getUerInfo : '')
    setUserId(tmp.uid)
  }, [userId])

  const handdleDelete = (id: string) => {
    const postRef = ref(db, "/posts");
    get(postRef)
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          if (post.id === id) {
            const postKey = childSnapshot.key;
            const postToDeleteRef = ref(db, `/posts/${postKey}`);
            remove(postToDeleteRef)
            .then(() => {
              console.log("Post deleted successfully");
              handleCloseUserMenu();
              handdleReFresh();
            })
          }
        });
      })
    .catch((error) => {
      console.error("Error deleting post:", error);
    });
  }

  return (
    <Box>
      <Modal
        open={openPost}
        onClose={handleClosePost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Paper sx={styleBoxPop}>
            <Content 
              postId={postId} 
              iconStatus={iconStatus} 
              userId={userId}
              handleClosePost={handleClosePost}
            />
          </Paper>
        </Box>
      </Modal>

      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <Item sx={{ display: "flex", flexDirection: "column" }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  src={Luffy}
                  sx={{ width: "60px", height: "60px", marginRight: "10px" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ fontSize: "16px" }}>
                    <b>User Name</b>
                    {emoji && (
                      <>
                        is feeling {String.fromCodePoint(parseInt(emoji, 16))}{" "}
                        {convertEmojiCodeToName(emoji)}
                      </>
                    )}
                  </Box>
                }
                secondary={
                  <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {createAt}
                      {iconStatus === "LockIcon" && <LockIcon />}
                      {iconStatus === "GroupIcon" && <GroupIcon />}
                      {iconStatus === "PublicIcon" && <PublicIcon />}
                      {status}
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
                  <MenuItem onClick={() => handdleDelete(postId)}>
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

            <CardContent>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "justify" }}
              >
                {caption}
              </Typography>
            </CardContent>
            <Box
              sx={{
                fontSize: "16px",
                display: "flex",
                justifyContent: "start",
                margin: 1,
              }}
            >
              {hashTagTopic}
            </Box>

            <ImageList
              sx={{ width: "100%", height: "auto", maxHeight: "500px", justifyContent:"center"}}
              cols={3}
              rowHeight={300}
            >
              {photoPost.map((image, index) => (
                <ImageListItem key={index} >
                  <img src={image} alt={`Preview ${index}`} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>

            <CardActions
              disableSpacing
              sx={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <Button aria-label="add to favorites" sx={{ color: "purple" }}>
                <ThumbUpIcon sx={{ marginRight: 1 }} /> Like
              </Button>
              <Button aria-label="add to favorites">
                <CommentIcon sx={{ marginRight: 1 }} /> Comment
              </Button>
              <Button aria-label="share" sx={{ color: "black" }}>
                <ScreenShareIcon sx={{ marginRight: 1 }} /> Share
              </Button>
            </CardActions>
            <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

            <CardActions
              disableSpacing
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button aria-label="add to favorites" sx={{ color: "red" }}>
                <ThumbUpIcon sx={{ marginRight: 1 }} /> {likeNumber}
              </Button>
              <Box>
                <Button aria-label="add to favorites" sx={{ color: "grey" }}>
                  100 Comments
                </Button>
                <Button aria-label="add to favorites" sx={{ color: "grey" }}>
                  100 Shares
                </Button>
              </Box>
            </CardActions>
            <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                mb: 1,
                gap: "10px",
              }}
            >
              <Avatar
                alt="User"
                src={Luffy}
                sx={{ width: "45px", height: "45px" }}
              />
              <Box style={{ width: "98%" }}>
                <TextField
                  id="outlined-basic"
                  label="Comment something..."
                  variant="outlined"
                  multiline
                  maxRows={4}
                  sx={{ width: "99%" }}
                  onClick={handletOpenPost}
                />
              </Box>
            </Box>
          </Item>
        </Stack>
      </Box>
    </Box>
  );
}
