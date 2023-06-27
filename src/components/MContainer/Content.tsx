import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Luffy from "../../../public/pictures/Luffy.webp";
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
import {collection, query, getDocs, updateDoc, doc, arrayUnion, where} from "firebase/firestore"

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface IData {
  postId: string;
  iconStatus: string;
  userId: string;
  likes: Like[];
}
interface IFunction {
  handleClosePost: () => void;
}

export default function Content({
  postId,
  iconStatus,
  userId,
  likes,
  handleClosePost,
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
  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };

  const [data, setData] = React.useState<Post[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(dbFireStore, 'posts'));
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }) as Post);
        setData(queriedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [reFresh]);

  const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
    const emoji = emojiData.find((data) => data.unified === emojiCode);
    return emoji ? emoji.name : undefined;
  };

  const initialState = {
    id: "",
    text: "",
    createdAt: "",
    author: "",
    // likeNumber: 0,
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
      author: userId,
      createdAt: new Date().toLocaleString(),
    };
    const postRef = doc(postsCollection, postId);
    updateDoc(postRef, {
      comments: arrayUnion(newComment),
    })
      .then(() => {
        clearState();
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
  };

  const [isLike, setIsLike] = React.useState(false);
  React.useEffect(() => {
    setIsLike(data.some((d) => d.id === postId && d.likes.some((l) => l.likeBy === userId)));
  }, [data, postId, userId]);

  const increaseLike = () => {
    const postsCollection = collection(dbFireStore, "posts");
    const updateLike = {
      likeBy: userId,
      createdAt: new Date().toLocaleString(),
    };
    const postRef = doc(postsCollection, postId);
    updateDoc(postRef, {
      likes: arrayUnion(updateLike),
    })
      .then(() => {
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error adding likes: ", error);
      });
  };
  const decreaseLike = async (id:string) => {
    const IndexLike = likes.findIndex(f => f.likeBy === userId)
    try {
      const q = query(collection(dbFireStore, 'posts'), where('__name__', '==', id));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      if (doc.exists()) {
        const postData = { id: doc.id, ...doc.data() } as Post;
        const updatedLike = [...postData.likes];
        updatedLike.splice(IndexLike, 1);
        const updatedData = { ...postData, likes: updatedLike };
        await updateDoc(doc.ref, updatedData);
        handleRefresh();
      } else {
        console.log('No post found with the specified ID');
      }
    } catch (error) {
      console.error('Error deleting like:', error);
    }
  };

  return (
    <Box>
      <IconButton onClick={handleClosePost}>
        <CancelIcon />
      </IconButton>
      {data
        .filter((f) => f.id === postId)
        .map((m) => (
          <Box key={m.id} sx={{ flexGrow: 1, p: 1 }}>
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
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={Luffy}
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
                              <b>User Name</b>
                              {m.emoji && (
                                <>
                                  is feeling
                                  {String.fromCodePoint(
                                    parseInt(m.emoji, 16)
                                  )}{" "}
                                  {convertEmojiCodeToName(m.emoji)}
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
                              {iconStatus === "LockIcon" && <LockIcon />}
                              {iconStatus === "GroupIcon" && <GroupIcon />}
                              {iconStatus === "PublicIcon" && <PublicIcon />}
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
                          color: isLike ? 'purple' : !isLike ? 'black' : 'black',
                        }}
                        onClick={isLike ? () => decreaseLike(postId) : () => increaseLike()}
                      >
                        <ThumbUpIcon sx={{ marginRight: 1 }} />
                        Like
                      </Button>
                      <Button aria-label="add to favorites" sx={{ color: "black" }}>
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
                                commentIndex = {index}
                                postId = {m.id}
                                handleRefresh={handleRefresh}
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
