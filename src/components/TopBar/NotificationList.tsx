import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    MenuItem,
    Divider,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Box,
    Modal,
    Paper,
} from "@mui/material";
import { INoti } from "../../interface/Notification";
import {
    collection,
    where,
    onSnapshot,
    query,
    updateDoc,
    doc,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";
import { styleBoxPop } from "../../utils/styleBox";
import Content from "../MContainer/Content";
import { Like, Post } from "../../interface/PostContent";
// import PopupAlert from "../PopupAlert";

interface IData {
    mobileMoreAnchorEl: null | HTMLElement;
    mobileMenuId: string;
    isMobileMenuOpen: boolean;
    notifications: INoti[];
    imageUrls: string[];
    handleMobileMenuClose: () => void;
    handleRefreshImage: () => void;
}

export default function NotificationList(props: IData) {
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [openPost, setOpenPost] = useState(false);
    const [likes, setLikes] = useState<Like[]>([]);
    const [postOwner, setPostOwner] = useState("");
    const [postId, setPostId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
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
    }, [props.notifications]);

    const handleReaded = async (notiId: string) => {
        const notification = collection(dbFireStore, "notifications");
        try {
            const notiDocRef = doc(notification, notiId);
            await updateDoc(notiDocRef, {
                isRead: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handletOpenPost = (postId: string, notiId: string) => {
        try {
            const queryData = query(
                collection(dbFireStore, "posts"),
                where("id", "==", postId)
            );
            const queryEventData = query(
                collection(dbFireStore, "events"),
                where("eventId", "==", postId)
            );
            const unsubscribeEvent = onSnapshot(
                queryEventData,
                (snapshot) => {
                    const queriedEventData = snapshot.docs.map((doc) => doc.data() as Post);
                    if (queriedEventData.length !== 0) {
                        handleReaded(notiId);
                        navigate(`/eventsDetail/${postId}`);
                    }
                    // else {
                    //     PopupAlert("This event was deleted already!", "error");
                    // }
                },
                (error) => {
                    console.error("Error fetching data:", error);
                }
            );

            const unsubscribe = onSnapshot(
                queryData,
                (snapshot) => {
                    const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
                    if (queriedData.length !== 0) {
                        setOpenPost(true);
                        setPostId(postId);
                        handleReaded(notiId);
                        setLikes(queriedData.flatMap((post) => post.likes));
                        setPostOwner(queriedData.flatMap((post) => post.owner)[0]);
                    }
                    // else {
                    //     PopupAlert("This post was deleted already!", "error");
                    // }
                },
                (error) => {
                    console.error("Error fetching data:", error);
                }
            );

            return () => {
                unsubscribe();
                unsubscribeEvent();
            };

        } catch (error) {
            console.error(error);
        }
    };

    const handleClosePost = () => {
        setOpenPost(false);
    };

    return (
        <>
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
                            userId={userInfo.uid}
                            likes={likes}
                            owner={postOwner}
                            handleClosePost={handleClosePost}
                            imageUrls={props.imageUrls}
                            handleRefreshImage={props.handleRefreshImage}
                        />
                    </Paper>
                </Box>
            </Modal>
            <Menu
                anchorEl={props.mobileMoreAnchorEl}
                id={props.mobileMenuId}
                open={props.isMobileMenuOpen}
                onClose={props.handleMobileMenuClose}
                onClick={props.handleMobileMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "auto",
                        height: props.notifications.length !== 0 ? "500px" : "auto",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        background: "#f3ebff",
                        color: "white",
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem
                    sx={{
                        fontSize: "20px",
                        padding: "5px",
                        fontWeight: "bold",
                        color: "black",
                        margin: 2,
                        width: "300px",
                        borderRadius: "10px",
                        "&:hover": {
                            color: "black",
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    Notifications
                </MenuItem>
                <Divider style={{ background: "white" }} />
                {props.notifications.length !== 0 && (
                    props.notifications.filter((item) => item.status !== "Private")
                        .map((noti) => (
                            <ListItem
                                key={noti.notiId}
                                alignItems="flex-start"
                                onClick={() => handletOpenPost(noti.contentId, noti.notiId)}
                                sx={{
                                    cursor: "pointer",
                                    mb: 0.5,
                                    backgroundColor: noti.isRead ? "" : "#e0e0e0",
                                    "&:hover": {
                                        backgroundColor: "primary.contrastText",
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    {inFoUser.filter((item) => item.uid == noti.actionBy).map((user, index) => (
                                        <Avatar
                                            key={index}
                                            alt="CMU"
                                            src={props.imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))}
                                        />
                                    ))}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <>
                                            {inFoUser.filter((item) => item.uid == noti.actionBy).map((user, index) => (
                                                <Typography
                                                    key={index}
                                                    sx={{
                                                        display: "inline",
                                                    }}
                                                    component="span"
                                                    variant="body2"
                                                    color="black"
                                                    fontWeight="bold"
                                                >
                                                    {`${user.firstName} ${user.lastName}`}
                                                </Typography>
                                            ))}
                                        </>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: "inline", fontSize: "16px" }}
                                                component="span"
                                                variant="body2"
                                                color="black"
                                            >
                                                {noti.actionTo != "" ? (
                                                    inFoUser.filter((item) => item.uid == noti.actionTo).map((user, index) => (
                                                        <Box key={index} sx={{ color: "black" }}>
                                                            {noti.actionMessage.substring(0, 30)}... <br />
                                                            to{" "}
                                                            <b>
                                                                {`${user.firstName} ${user.lastName}`}
                                                            </b>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    noti.actionMessage.substring(0, 30) + "..."
                                                )}
                                                <br />
                                                <Typography color="grey" fontSize={14}>
                                                    {noti.dateCreated}
                                                </Typography>
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        )))}
            </Menu>

        </>
    );
}
