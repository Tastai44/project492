import { useState, useEffect, MouseEvent } from "react";
import {
    Avatar,
    styled,
    Stack,
    Paper,
    Box,
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
    onSnapshot,
} from "firebase/firestore";
import { User } from "../../interface/User";

import PopupAlert from "../PopupAlert";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EventReasonContainer from "./EventReasonContainer";
import { EventPost, EventReport } from "../../interface/Event";
import { NavLink } from "react-router-dom";
import { themeApp } from "../../utils/Theme";

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

interface Idata {
    ownerId: string;
    details: string;
    status: string;
    eventId: string;
    title: string;
    topic: string;
    createAt: string;
    coverPhoto: string;
    reportNumber: number;
    reportEvent: EventReport[];
    imageUrls: string[];
}

export default function EventContent(props: Idata) {
    const [openReason, setOpenReason] = useState(false);
    const [iconStatus, setIconStatus] = useState("");
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(
        null
    );
    const [inFoUser, setInFoUser] = useState<User[]>([]);

    useEffect(() => {
        if (props.status === "Private") {
            setIconStatus("LockIcon");
        } else if (props.status === "Friend") {
            setIconStatus("GroupIcon");
        } else if (props.status === "Public") {
            setIconStatus("PublicIcon");
        }
    }, [iconStatus, props.status]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", props.ownerId)
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
    }, [props.ownerId]);

    const handleOpenReason = () => {
        setOpenReason(true);
    };
    const handleCloseReason = () => {
        setOpenReason(false);
    };

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleDelete = (eId: string) => {
        const postRef = doc(dbFireStore, "events", eId);
        getDoc(postRef);
        deleteDoc(postRef)
            .then(() => {
                PopupAlert("Post deleted successfully", "success");
                console.log("Post deleted successfully");
            })
            .catch((error) => {
                PopupAlert("Error deleting post", "error");
                console.error("Error deleting post: ", error);
            });
    };

    const handleApprove = async (id: string) => {
        const IndexReport = props.reportEvent.findIndex(
            (index) => index.eventId === id
        );
        try {
            const queryPost = query(
                collection(dbFireStore, "events"),
                where("eventId", "==", id)
            );
            const querySnapshot = await getDocs(queryPost);

            const doc = querySnapshot.docs[0];
            if (doc.exists()) {
                const eventData = { eventId: doc.id, ...doc.data() } as EventPost;
                const updateReport = [...eventData.reportEvent];
                updateReport.splice(IndexReport, 1);
                const updatedData = { ...eventData, reportEvent: updateReport };
                await updateDoc(doc.ref, updatedData);
                PopupAlert("Report approved successfully", "success");
            } else {
                PopupAlert("No post found with the specified ID", "error");
            }
        } catch (error) {
            console.error("Error approving report:", error);
        }
    };

    return (
        <Box sx={{ mb: 5, display: "flex", justifyContent: 'center', width: "100%" }}>
            <EventReasonContainer
                eventId={props.eventId}
                openReason={openReason}
                handleCloseReason={handleCloseReason}
                reportEvent={props.reportEvent}
                ownerId={props.ownerId}
                imageUrls={props.imageUrls}
            />
            {inFoUser.map((u) => (
                <Box key={u.uid} sx={{
                    width: "50%", [themeApp.breakpoints.down("lg")]: {
                        width: "100%"
                    }
                }}>
                    <Stack spacing={2}>
                        <Item sx={{ display: "flex", flexDirection: "column", borderRadius: "10px" }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar
                                        src={props.imageUrls.find((item) => item.includes(u.profilePhoto ?? ""))}
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
                                                    to={`/profileBlog/${props.ownerId}`}
                                                    style={{ color: "black", fontWeight: "bold" }}
                                                >
                                                    {`${u.firstName} ${u.lastName} `}
                                                </NavLink>
                                            </b>
                                            <NavLink
                                                to={`/eventsDetail/${props.eventId}`}
                                                style={{ color: themeApp.palette.primary.main }}
                                            >
                                                {`(${props.title})`}
                                            </NavLink>
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
                                        <MenuItem onClick={() => handleApprove(props.eventId)}>
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
                                        <MenuItem onClick={() => handleDelete(props.eventId)}>
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
                                    sx={{ textAlign: "justify" }}
                                >
                                    {props.details}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ textAlign: "justify" }}
                                >
                                    {props.topic.startsWith("#")
                                        ? props.topic
                                        : `#${props.topic}`}
                                </Typography>
                            </CardContent>
                            <ImageList
                                sx={{
                                    width: "100%",
                                    minHeight: "300px",
                                    maxHeight: "auto",
                                    justifyContent: "center",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                                cols={1}
                            >
                                <ImageListItem onClick={handleOpenReason}>
                                    <img
                                        src={props.imageUrls.find((item) => item.includes(props.coverPhoto ?? ""))}
                                        alt={`Preview`}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </ImageList>
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
            ))}
        </Box>
    );
}
