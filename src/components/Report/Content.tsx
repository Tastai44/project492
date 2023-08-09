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
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import emojiData from "emoji-datasource-facebook";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  where,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";
import { themeApp } from "../../utils/Theme";
import PopupAlert from "../PopupAlert";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Post, PostReport } from "../../interface/PostContent";
import ReasonContainer from "./ReasonContainer";

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
  postId: string;
  owner: string;
  groupName?: string;
  groupId?: string;
  reFreshInfo: number;
  reportNumber: number;
  reportPost: PostReport[];
}

interface IFunction {
  handleRefresh: () => void;
}

export default function Content(props: Idata & IFunction) {
  const [openReason, setOpenReason] = React.useState(false);
  const handleOpenReason = () => {setOpenReason(true)}
  const handleCloseReason = () => {setOpenReason(false)}
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

  const handleDelete = (pId: string) => {
    const postRef = doc(dbFireStore, "posts", pId);
    getDoc(postRef);
    deleteDoc(postRef)
      .then(() => {
        PopupAlert("Post deleted successfully", "success");
        console.log("Post deleted successfully");
        props.handleRefresh();
      })
      .catch((error) => {
        PopupAlert("Error deleting post", "error");
        console.error("Error deleting post: ", error);
      });
  };

  const handleApprove = async (id: string) => {
    const IndexReport = props.reportPost.findIndex((index) => index.postId === props.postId);
    try {
      const queryPost = query(collection(dbFireStore, "posts"), where("id", "==", id));
      const querySnapshot = await getDocs(queryPost);

      const doc = querySnapshot.docs[0];
      if(doc.exists()) {
        const postData = {id: doc.id, ...doc.data() } as Post;
        const updateReport = [...postData.reportPost];
        updateReport.splice(IndexReport, 1);
        const updatedData = { ...postData, reportPost: updateReport };
        await updateDoc(doc.ref, updatedData);
        props.handleRefresh();
        PopupAlert("Report approved successfully", "success");
      } else {
        PopupAlert("No post found with the specified ID", "error");
      }
    } catch (error) {
      console.error("Error approving report:", error);
    }
  }

  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", props.owner)
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
  }, [props.owner, props.reFreshInfo]);

  return (
    <Box sx={{ mb: 5 }}>
      <ReasonContainer 
        postId={props.postId}
        openReason={openReason}
        handleCloseReason={handleCloseReason}
        handleRefresh={props.handleRefresh}
        reportPost={props.reportPost}
        owner={props.owner}
      />
      {inFoUser.map((u) => (
        <Box key={u.uid}>
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
                      <Box sx={{ fontSize: "20px" }}>
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
                      <MenuItem onClick={() => handleApprove(props.postId)}>
                        <Typography
                          textAlign="center"
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "start",
                            fontSize: "18px",
                          }}
                        >
                          <AddTaskIcon /> Approve
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
                    </Menu>
                  </ListItemAvatar>
                </ListItem>

                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: "justify", fontSize: "25px" }}
                  >
                    {props.caption}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    fontSize: "25px",
                    display: "flex",
                    justifyContent: "start",
                    margin: 1,
                  }}
                >
                  {props.hashTagTopic.startsWith("#")
                    ? props.hashTagTopic
                    : `#${props.hashTagTopic}`}
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
                  <ImageList variant="masonry" cols={2} gap={2}>
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
                <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

                <CardActions
                  disableSpacing
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button aria-label="add to favorites" sx={{ color: "grey" }}>
                    <FlagOutlinedIcon />
                  </Button>
                  <Box>
                    <Button
                    onClick={handleOpenReason}
                      aria-label="add to favorites"
                      sx={{ color: "grey" }}
                    >
                      {props.reportNumber} Reports
                    </Button>
                  </Box>
                </CardActions>
                <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
              </Item>
            </Stack>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
