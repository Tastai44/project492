import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Luffy from "/images/Luffy.webp";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CardContent,
  ImageList,
  ImageListItem,
  TextField,
  Button,
  CardActions,
  Modal,
  Box,
} from "@mui/material";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CommentIcon from "@mui/icons-material/Comment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import emojiData from "emoji-datasource-facebook";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import CancelIcon from "@mui/icons-material/Cancel";
import Divider from "@mui/material/Divider";
import CommentContent from "./CommentContent";

import "firebase/database";
import { Post, Comment, Like } from "../../interface/PostContent";

import { dbFireStore } from "../../config/firebase";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  where,
  getDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import EditPost from "./EditPost";
import PopupAlert from "../PopupAlert";
import ReportCard from "../Report/ReportCard";
import { User } from "../../interface/User";
import { themeApp } from "../../utils/Theme";
import { NavLink } from "react-router-dom";

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface IData {
  postId: string;
  userId: string;
  owner?: string;
  likes: Like[];
}
interface IFunction {
  handleClosePost: () => void;
}

export default function Content(props: IData & IFunction) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [postData, setPostData] = React.useState<Post[]>([]);
  React.useEffect(() => {
    const queryData = query(
      collection(dbFireStore, "posts"),
      where("id", "==", props.postId)
    );

    const unsubscribe = onSnapshot(
      queryData,
      (snapshot) => {
        const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
        setPostData(queriedData);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
    const emoji = emojiData.find((data) => data.unified === emojiCode);
    return emoji ? emoji.name : undefined;
  };

  const initialState = {
    id: "",
    text: "",
    createdAt: "",
    author: "",
  };

  const [comment, setComment] = React.useState<Comment>(initialState);
  const clearState = () => {
    setComment({ ...initialState });
  };
  const handleChangeComment = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setComment((prevComment) => ({
      ...prevComment,
      [name]: value,
    }));
  };

  const postComment = () => {
    const postsCollection = collection(dbFireStore, "posts");
    const newComment = {
      text: comment.text,
      author: props.userId,
      createdAt: new Date().toLocaleString(),
    };
    const postRef = doc(postsCollection, props.postId);
    updateDoc(postRef, {
      comments: arrayUnion(newComment),
    })
      .then(() => {
        clearState();
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
  };

  const [isLike, setIsLike] = React.useState(false);
  React.useEffect(() => {
    setIsLike(
      postData.some(
        (d) =>
          d.id === props.postId &&
          d.likes.some((l) => l.likeBy === props.userId)
      )
    );
  }, [postData, props.postId, props.userId]);

  const increaseLike = async () => {
    const postsCollection = collection(dbFireStore, "posts");
    const updateLike = {
      likeBy: props.userId,
      createdAt: new Date().toLocaleString(),
    };
    const postRef = doc(postsCollection, props.postId);
    await updateDoc(postRef, {
      likes: arrayUnion(updateLike),
    });
  };
  const decreaseLike = async (id: string) => {
    const IndexLike = props.likes.findIndex((f) => f.likeBy === props.userId);
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
      } else {
        console.log("No post found with the specified ID");
      }
    } catch (error) {
      console.error("Error deleting like:", error);
    }
  };

  const [openEditPost, setOpenEditPost] = React.useState(false);
  const handletOpenEditPost = () => {
    setOpenEditPost(true);
    handleCloseUserMenu();
  };
  const handleCloseEditPost = () => setOpenEditPost(false);

  const handleDelete = (pId: string) => {
    const postRef = doc(dbFireStore, "posts", pId);
    getDoc(postRef)
      .then((docSnap) => {
        if (docSnap.exists() && docSnap.data().owner === props.userId) {
          deleteDoc(postRef)
            .then(() => {
              props.handleClosePost();
              PopupAlert("Post deleted successfully", "success");
            })
            .catch((error) => {
              console.error("Error deleting post: ", error);
            });
        } else {
          PopupAlert(
            "You don't have permission to delete this post",
            "warning"
          );
          console.log("You don't have permission to delete this post");
        }
      })
      .catch((error) => {
        console.error("Error fetching post: ", error);
      });
  };

  const [openReportPost, setOpenReportPost] = React.useState(false);
  const handletOpenReport = () => {
    setOpenReportPost(true);
    handleCloseUserMenu();
  };
  const handleCloseReport = () => setOpenReportPost(false);

  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  React.useEffect(() => {
    const queryData = query(
      collection(dbFireStore, "users"),
      where("uid", "==", props.owner)
    );
    const unsubscribe = onSnapshot(
      queryData,
      (snapshot) => {
        const queriedData = snapshot.docs.map((doc) => doc.data() as User);
        setInFoUser(queriedData);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [props.owner]);

  return (
    <Box>
      <Modal
        open={openReportPost}
        onClose={handleCloseReport}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <ReportCard
            handleCloseReport={handleCloseReport}
            postId={props.postId}
          />
        </Box>
      </Modal>
      <IconButton onClick={props.handleClosePost}>
        <CancelIcon />
      </IconButton>
      {postData.map((m) => (
        <Box key={m.id} sx={{ flexGrow: 1, p: 1 }}>
          <Modal
            open={openEditPost}
            onClose={handleCloseEditPost}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
              <EditPost
                handleCloseEditPost={handleCloseEditPost}
                oldStatus={m.status}
                caption={m.caption}
                hashTagTopic={m.hashTagTopic}
                oldPhoto={m.photoPost}
                oldEmoji={m.emoji !== undefined ? m.emoji : ""}
                postId={props.postId}
              />
            </Box>
          </Modal>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Item>
                <Box sx={{ height: "auto", maxWidth: "lg", minWidth: "sm" }}>
                  {m.photoPost.length == 1 ? (
                    <>
                      <ImageList variant="masonry" cols={1}>
                        {m.photoPost.map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              srcSet={image}
                              alt={`${index}`}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </>
                  ) : (
                    <ImageList variant="masonry" cols={2} gap={10}>
                      {m.photoPost.map((image, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={image}
                            srcSet={image}
                            alt={`${index}`}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                </Box>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box>
                    {inFoUser.map((user) => (
                      <ListItem key={user.uid}>
                        <ListItemAvatar>
                          <Avatar
                            src={user.profilePhoto}
                            sx={{
                              width: "60px",
                              height: "60px",
                              marginRight: "10px",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontSize: "16px" }}>
                              <b>
                                {user.firstName} {user.lastName}
                                <NavLink
                                  to={`/groupDetail/${m.groupId}`}
                                  style={{
                                    color: themeApp.palette.primary.main,
                                  }}
                                >
                                  {m.groupName ? ` (${m.groupName}) ` : ""}
                                </NavLink>
                              </b>
                              {m.emoji && (
                                <>
                                  is feeling
                                  {String.fromCodePoint(
                                    parseInt(m.emoji, 16)
                                  )}{" "}
                                  {convertEmojiCodeToName(
                                    m.emoji
                                  )?.toLocaleLowerCase()}
                                </>
                              )}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {m.createAt}
                              {m.status === "Private" && <LockIcon />}
                              {m.status === "Friend" && <GroupIcon />}
                              {m.status === "Public" && <PublicIcon />}
                              {m.status}
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
                            <MenuItem
                              onClick={handletOpenEditPost}
                              disabled={props.owner !== props.userId}
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
                                <BorderColorOutlinedIcon /> Edit
                              </Typography>
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleDelete(props.postId)}
                              disabled={props.owner !== props.userId}
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
                            <MenuItem onClick={handletOpenReport}>
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
                    ))}

                    <CardContent>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textAlign: "justify" }}
                      >
                        {m.caption}
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
                      {m.hashTagTopic}
                    </Box>
                  </Box>
                  <Divider />
                  <CardActions
                    disableSpacing
                    sx={{ display: "flex", justifyContent: "space-between" }}
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
                      aria-label="add to favorites"
                      sx={{ color: "black" }}
                    >
                      <CommentIcon sx={{ marginRight: 1 }} /> Comment
                    </Button>
                    <Button aria-label="share" sx={{ color: "black" }}>
                      <ScreenShareIcon sx={{ marginRight: 1 }} /> Share
                    </Button>
                  </CardActions>
                  <Divider />
                  <Box
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{m.likes.length} likes</Typography>
                    <Typography>{m.comments.length} comments</Typography>
                    <Typography>10 shares</Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "space-evenly",
                      mt: 2,
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      alt="User"
                      src={Luffy}
                      sx={{ width: "45px", height: "45px" }}
                    />
                    <Box sx={{ width: "98%", display: "flex", gap: 2 }}>
                      <TextField
                        name="text"
                        size="small"
                        id="outlined-basic"
                        label="Comment something..."
                        variant="outlined"
                        multiline
                        maxRows={4}
                        sx={{ width: "99%" }}
                        value={comment.text}
                        onChange={handleChangeComment}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={postComment}
                        sx={{
                          backgroundColor: "#8E51E2",
                          color: "white",
                          "&:hover": {
                            color: "black",
                            backgroundColor: "#E1E1E1",
                          },
                          maxHeight: "40px",
                        }}
                        type="submit"
                      >
                        Comment
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      mb: 2,
                      height: "380px",
                      maxHeight: "500px",
                      overflowY: "auto",
                    }}
                  >
                    {m.comments.length !== 0 ? (
                      <>
                        {m.comments.map((comment, index) => (
                          <Box key={index}>
                            <CommentContent
                              text={comment.text}
                              createAt={comment.createdAt}
                              commentIndex={index}
                              postId={m.id}
                              author={comment.author}
                              userId={props.userId}
                            />
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Box>There are comment!</Box>
                    )}
                  </Box>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
