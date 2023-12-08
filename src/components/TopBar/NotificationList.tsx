import { useEffect, useState } from "react";
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
    const [inFoShareUser, setInShareFoUser] = useState<User[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const userId =
        props.notifications.find((noti) => noti.actionBy)?.actionBy ?? "";
    const shareId =
        props.notifications.find((noti) => noti.actionTo)?.actionTo ?? "";
    const [openPost, setOpenPost] = useState(false);
    const [likes, setLikes] = useState<Like[]>([]);
    const [postOwner, setPostOwner] = useState("");
    const [postId, setPostId] = useState("");

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", userId)
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
    }, [userId]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", shareId)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setInShareFoUser(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [shareId]);

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
        setOpenPost(true);
        setPostId(postId);
        handleReaded(notiId);

        const queryData = query(
            collection(dbFireStore, "posts"),
            where("id", "==", postId)
        );

        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
                setLikes(queriedData.flatMap((post) => post.likes));
                setPostOwner(queriedData.flatMap((post) => post.owner)[0]);
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );

        return () => {
            unsubscribe();
        };
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
                                    <Avatar
                                        alt="CMU"
                                        src={props.imageUrls.find((item) => item.includes(inFoUser.find((user) => user.profilePhoto)?.profilePhoto ?? ""))}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{
                                                display: "inline",
                                            }}
                                            component="span"
                                            variant="body2"
                                            color="black"
                                            fontWeight="bold"
                                        >
                                            {`${inFoUser.find((user) => user.firstName)?.firstName} 
                                            ${inFoUser.find((user) => user.lastName)?.lastName} `}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            sx={{ display: "inline", fontSize: "16px" }}
                                            component="span"
                                            variant="body2"
                                            color="black"
                                        >
                                            {noti.actionTo ? (
                                                <>
                                                    {noti.actionMessage.substring(0, 30)}... <br />
                                                    to{" "}
                                                    <b>
                                                        {
                                                            inFoShareUser.find((shareTo) => shareTo.firstName)
                                                                ?.firstName
                                                        }
                                                    </b>
                                                </>
                                            ) : (
                                                noti.actionMessage.substring(0, 30) + "..."
                                            )}
                                            <br />
                                            <Typography color="red" fontSize={14}>
                                                {noti.dateCreated}
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        )))}
            </Menu>
        </>
    );
}
