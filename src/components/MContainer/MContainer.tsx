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
import Luffy from "/images/Luffy.webp";

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
import EditPost from "./EditPost";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
  arrayUnion,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { Like, Post, ShareUser } from "../../interface/PostContent";
import { styleBoxPop } from "../../utils/styleBox";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";
import { themeApp } from "../../utils/Theme";
import PopupAlert from "../PopupAlert";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface Idata {
  caption: string;
  hashTagTopic: string;
  status: string;
  createAt?: string;
  photoPost: string[];
  emoji?: string;
  likeNumber: number;
  postId: string;
  commentNumber: number;
  likes: Like[];
  shareUsers: ShareUser[];
  onwer: string;
  groupName?: string;
  groupId?: string;
  reFreshInfo: number;
}

interface IFunction {
  handleRefresh: () => void;
}

export default function MContainer(props: Idata & IFunction) {
  const [iconStatus, setIconStatus] = React.useState("");
  React.useEffect(() => {
    if (props.status === "Private") {
      setIconStatus("LockIcon");
    } else if (props.status === "Friend") {
      setIconStatus("GroupIcon");
    } else if (props.status === "Public") {
      setIconStatus("PublicIcon");
    }
  }, [iconStatus, props.status]);

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
  const handleClosePost = () => {
    props.handleRefresh();
    setOpenPost(false);
  };

  const [openEditPost, setOpenEditPost] = React.useState(false);
  const handletOpenEditPost = () => {
    setOpenEditPost(true);
    handleCloseUserMenu();
  };
  const handleCloseEditPost = () => setOpenEditPost(false);

  const [userId, setUserId] = React.useState("");
  React.useEffect(() => {
    const getUerInfo = localStorage.getItem("user");
    const tmp = JSON.parse(getUerInfo ? getUerInfo : "");
    setUserId(tmp.uid);
  }, [userId]);

  const handleDelete = (pId: string) => {
    const postRef = doc(dbFireStore, "posts", pId);
    getDoc(postRef)
      .then((docSnap) => {
        if (docSnap.exists() && docSnap.data().owner === userId) {
          deleteDoc(postRef)
            .then(() => {
              alert("Post deleted successfully");
              console.log("Post deleted successfully");
              props.handleRefresh();
            })
            .catch((error) => {
              console.error("Error deleting post: ", error);
            });
        } else {
          console.log("You don't have permission to delete this post");
        }
      })
      .catch((error) => {
        console.error("Error fetching post: ", error);
      });
  };

  const increaseLike = () => {
    const postsCollection = collection(dbFireStore, "posts");
    const updateLike = {
      likeBy: userId,
      createdAt: new Date().toLocaleString(),
    };
    const postRef = doc(postsCollection, props.postId);
    updateDoc(postRef, {
      likes: arrayUnion(updateLike),
    })
      .then(() => {
        props.handleRefresh();
        PopupAlert("Liked", "success");
      })
      .catch((error) => {
        console.error("Error adding likes: ", error);
      });
  };

  const isLike = props.likes.some((f) => f.likeBy === userId);
  const decreaseLike = async (id: string) => {
    const IndexLike = props.likes.findIndex((f) => f.likeBy === userId);
    try {
      const q = query(collection(dbFireStore, "posts"), where("id", "==", id));
      const querySnapshot = await getDocs(q);

      const doc = querySnapshot.docs[0];
      if (doc.exists()) {
        const postData = { id: doc.id, ...doc.data() } as Post;
        const updatedLike = [...postData.likes];
        updatedLike.splice(IndexLike, 1);
        const updatedData = { ...postData, likes: updatedLike };
        await updateDoc(doc.ref, updatedData);
        props.handleRefresh();
      } else {
        console.log("No post found with the specified ID");
      }
    } catch (error) {
      console.error("Error deleting like:", error);
    }
  };

  const isShare = props.shareUsers.some((share) => share.uid === userId);
  const handleShare = async () => {
    try {
      const postsCollection = collection(dbFireStore, "posts");
      const updateShare = {
        uid: userId,
        createdAt: new Date().toLocaleString(),
      };
      const postRef = doc(postsCollection, props.postId);
      updateDoc(postRef, {
        shareUsers: arrayUnion(updateShare),
      })
        .then(() => {
          props.handleRefresh();
        })
        .catch((error) => {
          console.error("Error share", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const unShare = async (id: string) => {
    const IndexShare = props.shareUsers.findIndex((index) => index.uid === userId);
    try {
      const queyShare = query(collection(dbFireStore, "posts"), where("id", "==", id));
      const querySnapshot = await getDocs(queyShare);

      const doc = querySnapshot.docs[0];
      if(doc.exists()) {
        const postData = { id: doc.id, ...doc.data()} as Post;
        const updateShare = [...postData.shareUsers];
        updateShare.splice(IndexShare, 1);
        const updateData = {...postData, shareUsers: updateShare};
        await updateDoc(doc.ref, updateData);
        props.handleRefresh();
      } else {
        console.log("No post found with the specified ID");
      }
    }catch (error) {
      console.error(error)
    }
  }

  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", props.onwer)
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
  }, [props.onwer, props.reFreshInfo]);

  return (
    <Box>
      {inFoUser.map((u) => (
        <Box key={u.uid}>
          <Modal
            open={openPost}
            onClose={handleClosePost}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
              <Paper sx={styleBoxPop}>
                <Content
                  postId={props.postId}
                  userId={userId}
                  handleClosePost={handleClosePost}
                  handleRefreshData={props.handleRefresh}
                  likes={props.likes}
                />
              </Paper>
            </Box>
          </Modal>

          <Modal
            open={openEditPost}
            onClose={handleCloseEditPost}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
              <EditPost
                handleCloseEditPost={handleCloseEditPost}
                handleRefresh={props.handleRefresh}
                handleRefreshData={props.handleRefresh}
                oldStatus={props.status}
                caption={props.caption}
                hashTagTopic={props.hashTagTopic}
                oldPhoto={props.photoPost}
                oldEmoji={props.emoji !== undefined ? props.emoji : ""}
                postId={props.postId}
              />
            </Box>
          </Modal>

          <Box sx={{ width: "100%" }}>
            <Stack spacing={2}>
              <Item sx={{ display: "flex", flexDirection: "column" }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={u.profilePhoto}
                      sx={{
                        width: "60px",
                        height: "60px",
                        marginRight: "10px",
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ fontSize: "16px" }}>
                        <b>
                          {u.username}
                          <NavLink
                            to={`/groupDetail/${props.groupId}`}
                            style={{ color: themeApp.palette.primary.main }}
                          >
                            {props.groupName ? ` (${props.groupName}) ` : ""}
                          </NavLink>
                        </b>
                        {props.emoji && (
                          <>
                            is feeling
                            {String.fromCodePoint(parseInt(props.emoji, 16))}
                            {convertEmojiCodeToName(
                              props.emoji
                            )?.toLocaleLowerCase()}
                          </>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {props.createAt}
                        {iconStatus === "LockIcon" && <LockIcon />}
                        {iconStatus === "GroupIcon" && <GroupIcon />}
                        {iconStatus === "PublicIcon" && <PublicIcon />}
                        {props.status}
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
                      <MenuItem onClick={handletOpenEditPost}>
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
                      <MenuItem onClick={() => handleDelete(props.postId)}>
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
                    {props.caption}
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
                  {props.hashTagTopic}
                </Box>
                {props.photoPost.length == 1 ? (
                  <ImageList
                    sx={{
                      width: "100%",
                      minHeight: "300px",
                      maxHeight: "auto",
                      justifyContent: "center",
                    }}
                    cols={1}
                    onClick={handletOpenPost}
                  >
                    {props.photoPost.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image}
                          alt={`Preview ${index}`}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <ImageList
                    variant="masonry"
                    cols={2}
                    gap={2}
                    onClick={handletOpenPost}
                  >
                    {props.photoPost.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image}
                          alt={`Preview ${index}`}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
                <Divider style={{ background: "#EAEAEA" }} />
                <CardActions
                  disableSpacing
                  sx={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Button
                    aria-label="add to favorites"
                    sx={{
                      color: isLike ? "purple" : !isLike ? "black" : "black",
                    }}
                    onClick={
                      isLike
                        ? () => decreaseLike(props.postId)
                        : () => increaseLike()
                    }
                  >
                    <ThumbUpIcon sx={{ marginRight: 1 }} />
                    Like
                  </Button>
                  <Button
                    onClick={handletOpenPost}
                    aria-label="add to favorites"
                    sx={{ color: "black" }}
                  >
                    <CommentIcon sx={{ marginRight: 1 }} /> Comment
                  </Button>
                  <Button
                    onClick={
                      isShare
                      ? () => unShare(props.postId)
                      : () => handleShare()
                    }
                    aria-label="share"
                    sx={{
                      color: isShare ? "purple" : !isShare ? "black" : "black",
                    }}
                  >
                    <ScreenShareIcon sx={{ marginRight: 1 }} /> Share
                  </Button>
                </CardActions>
                <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

                <CardActions
                  disableSpacing
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button aria-label="add to favorites" sx={{ color: "grey" }}>
                    {props.likeNumber} Likes
                  </Button>
                  <Box>
                    <Button
                      aria-label="add to favorites"
                      sx={{ color: "grey" }}
                    >
                      {props.commentNumber} Comments
                    </Button>
                    <Button
                      aria-label="add to favorites"
                      sx={{ color: "grey" }}
                    >
                      {props.shareUsers.length} Shares
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
      ))}
    </Box>
  );
}
