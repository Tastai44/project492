import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardMedia,
    Divider,
    IconButton,
    Modal,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DateRangeIcon from "@mui/icons-material/DateRange";

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
import { EventPost, Interest } from "../../interface/Event";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import EditEvent from "./EditEvent";
import PopupAlert from "../PopupAlert";
import { themeApp } from "../../utils/Theme";
import AskPopDeleteEvent from "./AskPopDeleteEvent";

interface IData {
    eventId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    title: string;
    coverPhoto: string;
    topic: string;
    ageRage: number;
    interest: Interest[];
    owner: string;
    details: string;
    location: string;
    status: string;
}

interface IFunction {
    handleOpenShare: () => void;
    handleReFreshImage: () => void;
    imageUrls: string[];
}

export default function ProCoverImage(props: IData & IFunction) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const IsOwner = userInfo.uid === props.owner;
    const isInterest = props.interest.some((f) => f.interestBy === userInfo.uid);
    const [open, setOpen] = useState(false);
    const [openAskPop, setOpenAskPop] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const increaseInterest = async () => {
        const eventtsCollection = collection(dbFireStore, "events");
        const updateInterest = {
            interestBy: userInfo.uid,
            createdAt: new Date().toLocaleString(),
        };
        const postRef = doc(eventtsCollection, props.eventId);
        await updateDoc(postRef, {
            interest: arrayUnion(updateInterest),
        });
    };

    const decreaseInterest = async (id: string) => {
        const IndexLike = props.interest.findIndex((f) => f.interestBy === userInfo.uid);
        try {
            const q = query(
                collection(dbFireStore, "events"),
                where("eventId", "==", id)
            );
            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];
            if (doc.exists()) {
                const eventData = { eventId: doc.id, ...doc.data() } as EventPost;
                const updatedLike = [...eventData.interest];
                updatedLike.splice(IndexLike, 1);
                const updatedData = { ...eventData, interest: updatedLike };
                await updateDoc(doc.ref, updatedData);
            } else {
                console.log("No event found with the specified ID");
            }
        } catch (error) {
            console.error("Error deleting interest:", error);
        }
    };

    const handleDelete = (eId: string) => {
        const postRef = doc(dbFireStore, "events", eId);
        getDoc(postRef)
            .then((docSnap) => {
                if (docSnap.exists() && docSnap.data().owner === userInfo.uid) {
                    deleteDoc(postRef)
                        .then(() => {
                            navigate("/events");
                            PopupAlert("Deleted an event successfully", "success");
                        })
                        .catch((error) => {
                            console.error("Error deleting Event: ", error);
                        });
                } else {
                    console.log("You don't have permission to delete this Event");
                }
            })
            .catch((error) => {
                console.error("Error fetching Event: ", error);
            });
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <EditEvent
                        closeAdd={handleClose}
                        handleReFreshImage={props.handleReFreshImage}
                        eventId={props.eventId}
                        startDate={props.startDate}
                        startTime={props.startTime}
                        endDate={props.endDate}
                        endTime={props.endTime}
                        title={props.title}
                        coverPhoto={props.coverPhoto}
                        topic={props.topic}
                        ageRage={props.ageRage}
                        details={props.details}
                        status={props.status}
                        location={props.location}
                        imageUrls={props.imageUrls}
                    />
                </Box>
            </Modal>
            <Modal
                open={openAskPop}
            >
                <Box>
                    <AskPopDeleteEvent
                        handleCloseAsk={() => setOpenAskPop(false)}
                        handleDelete={() => handleDelete(props.eventId)}
                        eventId={props.eventId}
                    />
                </Box>
            </Modal>

            <Card sx={{
                maxWidth: "100%"
            }}>
                <CardMedia
                    sx={{ height: 300, borderRadius: "10px" }}
                    image={props.imageUrls.find((item) => item.includes(props.coverPhoto ?? ""))}
                    title="green iguana"
                />
            </Card>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "-50px"
                }}
            >
                <Card sx={{
                    borderRadius: "10px", width: "95%", backgroundColor: "white", display: "flex", [themeApp.breakpoints.down("md")]: {
                        background: "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(255, 255, 255, 1))",
                        width: "100%",
                    }
                }}>
                    <Box sx={{
                        display: "flex", flexDirection: "column", width: "100%",
                        [themeApp.breakpoints.down("lg")]: {
                            textAlign: "center"
                        }
                    }}>
                        <Box
                            sx={{
                                mt: 1,
                                ml: 1,
                                display: "flex",
                                justifyContent: "flex-start",
                                fontSize: "25px",
                                [themeApp.breakpoints.down("md")]: {
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "bold",
                                }
                            }}
                        >
                            {props.title}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                [themeApp.breakpoints.down("md")]: {
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }
                            }}
                        >
                            <Box sx={{ ml: 1 }}>
                                <NavLink
                                    to={`https://www.google.com/search?q=${props.location}`}
                                    target="_blank"
                                >
                                    <Button startIcon={<LocationOnIcon />}>
                                        {props.location}
                                    </Button>
                                </NavLink>
                            </Box>
                            <Box
                                sx={{ display: "flex", gap: 0.5, m: 1, alignItems: "center" }}
                            >
                                <IconButton size="large" onClick={props.handleOpenShare}>
                                    <ShareIcon />
                                </IconButton>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontSize: "16px",
                                        backgroundColor: isInterest
                                            ? "primary.main"
                                            : !isInterest
                                                ? "white"
                                                : "white",
                                        color: isInterest
                                            ? "white"
                                            : !isInterest
                                                ? "black"
                                                : "black",
                                        border: "1px solid #8E51E2",
                                        "&:hover": {
                                            color: "white",
                                            border: "1px solid",
                                            backgroundColor: "primary.main",
                                        },
                                    }}
                                    onClick={
                                        isInterest
                                            ? () => decreaseInterest(props.eventId)
                                            : () => increaseInterest()
                                    }
                                    startIcon={<FavoriteIcon sx={{ width: "16px" }} />}
                                >
                                    {isInterest ? "Interested" : "Interest"}
                                </Button>
                                {IsOwner ? (
                                    <>
                                        <Button
                                            onClick={handleOpen}
                                            size="small"
                                            variant="text"
                                            sx={{
                                                fontSize: "16px",
                                                backgroundColor: "primary.main",
                                                color: "white",
                                                "&:hover": {
                                                    color: "white",
                                                    backgroundColor: "grey",
                                                },
                                            }}
                                            startIcon={
                                                <BorderColorOutlinedIcon sx={{ width: "16px" }} />
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => setOpenAskPop(true)}
                                            size="small"
                                            variant="text"
                                            sx={{
                                                fontSize: "16px",
                                                backgroundColor: "grey",
                                                color: "white",
                                                "&:hover": {
                                                    color: "black",
                                                    backgroundColor: "primary.contrastText",
                                                },
                                            }}
                                            startIcon={
                                                <DeleteOutlineOutlinedIcon sx={{ width: "16px" }} />
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </>
                                ) : null}
                            </Box>
                        </Box>
                        <Divider light sx={{ mb: 1 }} />
                        <Box sx={{
                            display: "flex", justifyContent: "space-between",
                            [themeApp.breakpoints.down("lg")]: {
                                flexWrap: "wrap"
                            }
                        }}>
                            <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                                <DateRangeIcon />
                                <div>
                                    <b>Start:</b> {props.startDate}, {props.startTime} | <b>End:</b> {props.endDate}
                                    , {props.endTime}
                                </div>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                                {/* <TagIcon /> */}
                                <div>
                                    <NavLink to={`/hashtag/${props.topic}`}>
                                        {props.topic}
                                    </NavLink> | {props.ageRage}+ | {props.status}
                                </div>
                            </Box>

                        </Box>
                    </Box>
                </Card>
            </Box>
        </div>
    );
}
