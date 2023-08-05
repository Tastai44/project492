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
import Content from "../../components/MContainer/Content";
import EditPost from "../../components/MContainer/EditPost";
import ShareCard from "../../components/MContainer/ShareCard";
import PopupAlert from "../../components/PopupAlert";
import ReportCard from "../../components/Report/ReportCard";

interface Idata {
  postId: string;
  shareUsers: ShareUser[];
  reFreshInfo: number;
  userId?: string;
}

interface IFunction {
  handleRefresh: () => void;
}

export default function ShareContent(props: Idata & IFunction) {
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  React.useMemo(() => {
    const shareByValue = props.shareUsers.find((share) => share.shareBy);
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", shareByValue?.shareBy)
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
  }, [props.shareUsers]);

  const handleDeleteShare = async () => {
    const IndexShare = props.shareUsers.findIndex((index) => index.shareBy == props.userId || index.shareTo==props.userId);
    try {
        const queryData = query(collection(dbFireStore, "posts"), where("id", "==", props.postId));
        const querySnapshot = await getDocs(queryData);
        const doc = querySnapshot.docs[0];
        if(doc.exists()) {
            const postData = { id: doc.id, ...doc.data() } as Post;
            const updateShare = [...postData.shareUsers];
            updateShare.splice(IndexShare, 1);
            const updateData = { ...postData, shareUsers: updateShare};
            await updateDoc(doc.ref, updateData);
            props.handleRefresh();
            PopupAlert("Deleted share content succussfully", "success")
        } else {
            PopupAlert("There is no share to delete!", "warning")
            console.log("No share to delete.")
        }
    } catch (error) {
        console.error(error);
    }
  }


  return (
    <Box sx={{ backgroundColor: "primary.contrastText" }}>
      {props.shareUsers.map((share, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar
                src={inFoUser.find((user) => user.firstName)?.profilePhoto}
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
                <b>Shared by</b>{" "}
                {`${inFoUser.find((user) => user.firstName)?.firstName} ${
                  inFoUser.find((user) => user.firstName)?.lastName
                }`}
              </Box>
            }
            secondary={
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                {share.createdAt}
                {share.status === "Private" && <LockIcon />}
                {share.status === "Friend" && <GroupIcon />}
                {share.status === "Public" && <PublicIcon />}
                {share.status}
              </Typography>
            }
          />
          <ListItemAvatar>
            <IconButton onClick={handleDeleteShare}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </ListItemAvatar>
        </ListItem>
      ))}
    </Box>
  );
}
