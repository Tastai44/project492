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
import Content from "./Content";
import EditPost from "./EditPost";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
    onSnapshot,
} from "firebase/firestore";
import { Like, Post, ShareUser } from "../../interface/PostContent";
import { styleBoxPop } from "../../utils/styleBox";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";
import { themeApp } from "../../utils/Theme";
import PopupAlert from "../PopupAlert";
import ReportCard from "../Report/ReportCard";
import ShareCard from "./ShareCard";

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
    owner: string;
    groupName?: string;
    groupId?: string;
    location?: string;
    userInfo: User[];
}

export default function MContainer(props: Idata) {
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
        setOpenPost(false);
    };

    const [openEditPost, setOpenEditPost] = React.useState(false);
    const handletOpenEditPost = () => {
        setOpenEditPost(true);
        handleCloseUserMenu();
    };
    const handleCloseEditPost = () => setOpenEditPost(false);

    const [openReportPost, setOpenReportPost] = React.useState(false);
    const handletOpenReport = () => {
        setOpenReportPost(true);
        handleCloseUserMenu();
    };
    const handleCloseReport = () => setOpenReportPost(false);

    const userInfo = JSON.parse(localStorage.getItem("user") || "null");

    const handleDelete = (pId: string) => {
        const postRef = doc(dbFireStore, "posts", pId);
        getDoc(postRef)
            .then((docSnap) => {
                if (docSnap.exists() && docSnap.data().owner === userInfo.uid) {
                    deleteDoc(postRef)
                        .then(() => {
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

    const increaseLike = async () => {
        const postsCollection = collection(dbFireStore, "posts");
        const updateLike = {
            likeBy: userInfo.uid,
            createdAt: new Date().toLocaleString(),
        };
        try {
            const postRef = doc(postsCollection, props.postId);
            await updateDoc(postRef, {
                likes: arrayUnion(updateLike),
            });
        } catch (err) {
            console.error("Like error: ", err);
        }
    };

    const isLike = props.likes.some((f) => f.likeBy === userInfo.uid);
    const decreaseLike = async (id: string) => {
        const IndexLike = props.likes.findIndex((f) => f.likeBy === userInfo.uid);
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
            console.error("Error dislike:", error);
        }
    };

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

    const [openShare, setOpenShare] = React.useState(false);
    const handleOpenShare = () => setOpenShare(true);
    const handleCloseShare = () => setOpenShare(false);

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
                                    userId={userInfo.uid}
                                    handleClosePost={handleClosePost}
                                    likes={props.likes}
                                    owner={props.owner}
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
                                oldStatus={props.status}
                                caption={props.caption}
                                hashTagTopic={props.hashTagTopic}
                                oldPhoto={props.photoPost}
                                oldEmoji={props.emoji !== undefined ? props.emoji : ""}
                                postId={props.postId}
                            />
                        </Box>
                    </Modal>

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
                                                    <NavLink
                                                        to={`/profileBlog/${u.uid}`}
                                                        style={{ color: "black", fontWeight: "bold" }}
                                                    >
                                                        {`${u.firstName} ${u.lastName}`}
                                                    </NavLink>
                                                    <NavLink
                                                        to={`/groupDetail/${props.groupId}`}
                                                        style={{ color: themeApp.palette.primary.main }}
                                                    >
                                                        {props.groupName ? ` (${props.groupName}) ` : ""}
                                                    </NavLink>
                                                </b>
                                                {props.emoji && (
                                                    <>
                                                        {" "}
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
                                                {props.status === "Private" && <LockIcon />}
                                                {props.status === "Friend" && <GroupIcon />}
                                                {props.status === "Public" && <PublicIcon />}
                                                {props.status}
                                                <LocationOnIcon color="error" /> {props.location}
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
                                                disabled={props.owner !== userInfo.uid}
                                                onClick={handletOpenEditPost}
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
                                                disabled={props.owner !== userInfo.uid}
                                                onClick={() => handleDelete(props.postId)}
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
                                        onClick={handleOpenShare}
                                        // onClick={
                                        //   isShare
                                        //     ? () => unShare(props.postId)
                                        //     : () => handleShare()
                                        // }
                                        sx={{ color: "black" }}
                                        aria-label="share"
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
                                {props.userInfo.map((user) => (
                                    <Box
                                        key={user.uid}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-evenly",
                                            mb: 1,
                                            gap: "10px",
                                        }}
                                    >
                                        <ShareCard
                                            openShare={openShare}
                                            handleCloseShare={handleCloseShare}
                                            friendList={user.friendList ?? []}
                                            postId={props.postId}
                                        />
                                        <Avatar
                                            alt="User"
                                            src={user.profilePhoto}
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
                                ))}
                            </Item>
                        </Stack>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
