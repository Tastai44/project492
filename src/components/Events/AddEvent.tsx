import * as React from "react";
import {
    Button,
    Divider,
    FormControl,
    IconButton,
    ImageList,
    ImageListItem,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { EventPost } from "../../interface/Event";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { doc } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import PopupAlert from "../PopupAlert";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

interface Ihandle {
    closeAdd: () => void;
}

export default function AddEvent({ closeAdd }: Ihandle) {
    const [userId, setUserId] = React.useState("");
    React.useEffect(() => {
        const getUerInfo = localStorage.getItem("user");
        const tmp = JSON.parse(getUerInfo ? getUerInfo : "");
        setUserId(tmp.uid);
    }, []);

    const [status, setStatus] = React.useState("");
    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = React.useState<string[]>([]);

    const handleClearImage = () => {
        setPreviewImages([]);
    };
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files) {
            try {
                const selectedFiles = Array.from(files);
                const readerPromises = selectedFiles.map((file) => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result as string);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });

                const base64Images = await Promise.all(readerPromises);
                setPreviewImages(base64Images);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const initialState = {
        eventId: "",
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        topic: "",
        ageRage: 0,
        details: "",
        status: "",
        coverPhoto: "",
        interest: [],
        owner: "",
        createAt: "",
        shareUsers: [],
        reportEvent: []
    };
    const [event, setEvent] = React.useState<EventPost>(initialState);
    const clearState = () => {
        setEvent({ ...initialState });
        handleClearImage();
    };
    const handleChangeEvent = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const createEvent = async () => {
        const eventCollection = collection(dbFireStore, "events");
        const newEvent = {
            eventId: "",
            title: event.title,
            startDate: event.startDate
                ? event.startDate
                : new Date().toISOString().slice(0, 10),
            startTime: event.startTime
                ? event.startTime
                : new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            endDate: event.endDate
                ? event.endDate
                : new Date().toISOString().slice(0, 10),
            endTime: event.endTime
                ? event.endTime
                : new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            topic: event.topic,
            ageRage: event.ageRage,
            details: event.details,
            coverPhoto: previewImages[0],
            status: status,
            interest: [],
            shareUsers: [],
            reportEvent: [],
            createAt: new Date().toLocaleString(),
            owner: userId,
        };

        try {
            const docRef = doc(eventCollection);
            const eventId = docRef.id;
            const updatedEvent = { ...newEvent, eventId: eventId };
            await setDoc(docRef, updatedEvent);

            setEvent(updatedEvent);
            clearState();
            closeAdd();
            PopupAlert("Added an event successfully", "success");
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    return (
        <div style={{ color: "black" }}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5">
                    Add an event
                </Typography>
                <Divider sx={{ background: "grey" }} />
                <Box sx={{ mt: 1 }}>
                    <TextField
                        name="title"
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        label="Title"
                        variant="outlined"
                        onChange={handleChangeEvent}
                        value={event.title}
                    />

                    <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
                        <TextField
                            label="Start Date"
                            name="startDate"
                            sx={{ width: "100%" }}
                            id="outlined-basic"
                            variant="outlined"
                            type="date"
                            onChange={handleChangeEvent}
                            value={event.startDate || new Date().toISOString().slice(0, 10)}
                        />
                        <TextField
                            label="Start Time"
                            name="startTime"
                            sx={{ width: "100%" }}
                            id="outlined-basic"
                            variant="outlined"
                            type="time"
                            onChange={handleChangeEvent}
                            value={
                                event.startTime ||
                                new Date().toLocaleTimeString("en-US", {
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                            }
                        />
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                            label="End Date"
                            name="endDate"
                            sx={{ width: "100%" }}
                            id="outlined-basic"
                            variant="outlined"
                            type="date"
                            onChange={handleChangeEvent}
                            value={event.endDate || new Date().toISOString().slice(0, 10)}
                        />
                        <TextField
                            label="End Time"
                            name="endTime"
                            sx={{ width: "100%" }}
                            id="outlined-basic"
                            variant="outlined"
                            type="time"
                            onChange={handleChangeEvent}
                            value={
                                event.endTime ||
                                new Date().toLocaleTimeString("en-US", {
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                            }
                        />
                    </Box>

                    {/* <TextField
            sx={{ width: "100%", mb: 1 }}
            id="outlined-basic"
            label="Location"
            variant="outlined"
            type="text"
          /> */}
                    <TextField
                        name="topic"
                        sx={{ width: "100%", mb: 1 }}
                        id="outlined-basic"
                        label="#Topic"
                        variant="outlined"
                        multiline
                        onChange={handleChangeEvent}
                        value={event.topic}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <FormControl sx={{ width: "50%" }}>
                            <InputLabel id="demo-simple-select">Status</InputLabel>
                            <Select
                                label="Status"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                onChange={handleChange}
                            >
                                <MenuItem value={"Private"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <LockIcon /> Private
                                    </Box>
                                </MenuItem>
                                <MenuItem value={"Friend"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <GroupIcon /> Friend
                                    </Box>
                                </MenuItem>
                                <MenuItem value={"Public"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <PublicIcon /> Public
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            name="ageRage"
                            sx={{ width: "50%", mb: 1 }}
                            id="outlined-basic"
                            label="Rage Age"
                            type="number"
                            variant="outlined"
                            multiline
                            onChange={handleChangeEvent}
                            value={event.ageRage}
                        />
                    </Box>
                    <TextField
                        name="details"
                        sx={{ width: "100%", mb: 1 }}
                        id="outlined-basic"
                        label="Details"
                        variant="outlined"
                        multiline
                        onChange={handleChangeEvent}
                        value={event.details}
                    />
                    <FormControl
                        sx={{ width: "100%", mb: 1 }}
                        variant="outlined"
                        onClick={handleUploadClick}
                    >
                        <OutlinedInput
                            id="outlined-insertPhoto"
                            type={"file"}
                            inputProps={{ "aria-label": " " }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            endAdornment={
                                <InputAdornment position="end" sx={{ fontSize: "20px" }}>
                                    Cover photo
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
                <Typography
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                    <Button
                        sx={{
                            backgroundColor: "grey",
                            color: "white",
                            "&:hover": {
                                color: "black",
                                backgroundColor: "#E1E1E1",
                            },
                        }}
                        onClick={closeAdd}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={createEvent}
                        sx={{
                            backgroundColor: "#8E51E2",
                            color: "white",
                            "&:hover": {
                                color: "black",
                                backgroundColor: "#E1E1E1",
                            },
                        }}
                        type="submit"
                    >
                        Save
                    </Button>
                </Typography>
                {previewImages.length !== 0 && (
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <IconButton onClick={handleClearImage}>
                                <CancelIcon />
                            </IconButton>
                        </Box>
                        <ImageList
                            sx={{ width: "100%", height: "auto", maxHeight: "400px" }}
                            cols={1}
                            rowHeight={160}
                        >
                            {previewImages.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img src={image} alt={`Preview ${index}`} loading="lazy" />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                )}
            </Box>
        </div>
    );
}
