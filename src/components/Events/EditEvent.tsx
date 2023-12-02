import { useState, ChangeEvent, useEffect, useRef } from "react";
import {
    Autocomplete,
    Button,
    Divider,
    FormControl,
    IconButton,
    ImageList,
    ImageListItem,
    InputLabel,
    MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";

import "firebase/database";
import { dbFireStore, storage } from "../../config/firebase";
import { doc } from "firebase/firestore";
import { collection, getDoc, updateDoc } from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import { locations } from "../../helper/CMULocations";
import { styleBox } from "../../utils/styleBox";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { ref, uploadBytes } from "firebase/storage";
import heic2any from "heic2any";
import Loading from "../Loading";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";

interface Ihandle {
    closeAdd: () => void;
    imageUrls: string[];
}

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
    details: string;
    status: string;
    location: string;
}

export default function EditEvent(props: IData & Ihandle) {
    const [userId, setUserId] = useState("");
    const [location, setLocation] = useState(props.location);
    const [status, setStatus] = useState(`${props.status}`);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = useState<string>('');
    const [oldPicture, setOldPicture] = useState<string>(props.coverPhoto);
    const [openLoading, setLopenLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null);

    const initialState = {
        eventId: "",
        title: props.title,
        startDate: props.startDate,
        startTime: props.startTime,
        endDate: props.endDate,
        endTime: props.endTime,
        topic: props.topic,
        ageRage: props.ageRage,
        details: props.details,
        status: props.status,
        location: props.location,
        coverPhoto: props.coverPhoto,
    };
    const [event, setEvent] = useState<IData>(initialState);

    useEffect(() => {
        const getUerInfo = localStorage.getItem("user");
        const tmp = JSON.parse(getUerInfo ? getUerInfo : "");
        setUserId(tmp.uid);
    }, []);

    const handleChangeLocation = (
        _event: ChangeEvent<unknown>,
        newValue: string | null
    ) => {
        if (newValue) {
            setLocation(newValue);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const handleClearImage = () => {
        setPreviewImages('');
        setOldPicture('NoPhoto');
    };
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleUpload = async () => {
        if (imageUpload == null) return;
        const fileName = removeSpacesBetweenWords(imageUpload.name);
        const imageRef = ref(storage, `Images/event_${userId}${fileName}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            // handleEditEvent(`event_${userId}${fileName}`);
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setLopenLoading(true);
        setPreviewImages('');
        const fileInput = event.target;
        const fileName = fileInput.value;
        const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        const reader = new FileReader();

        if (fileNameExt === 'heic' || fileNameExt === 'HEIC') {
            const blob = fileInput.files?.[0];
            try {
                if (blob) {
                    const resultBlob = await heic2any({ blob, toType: 'image/jpg' }) as BlobPart;
                    const file = new File([resultBlob], `${event.target.files?.[0].name.split('.')[0]}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: new Date().getTime(),
                    });
                    setImageUpload(file);
                    reader.onloadend = () => {
                        setPreviewImages(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) {
                reader.onloadend = () => {
                    setPreviewImages(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
                setImageUpload(selectedFile);
            }
        }
        setLopenLoading(false);
    };

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

    const handleEditEvent = () => {
        setLopenLoading(true);
        const eventCollection = collection(dbFireStore, "events");
        const updatedEvent = {
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
            coverPhoto: imageUpload !== null ? removeSpacesBetweenWords(imageUpload.name) : props.coverPhoto,
            status: status,
            updateAt: new Date().toLocaleString(),
        };

        if (imageUpload) {
            handleUpload();
        }

        try {
            const docRef = doc(eventCollection, props.eventId);
            getDoc(docRef)
                .then(async (docSnap) => {
                    if (docSnap.exists() && docSnap.data().owner === userId) {
                        await updateDoc(docRef, updatedEvent);
                        clearState();
                        props.closeAdd();
                        PopupAlert("Event has edited successfully", "success");
                        setLopenLoading(false);
                    } else {
                        console.log("You don't have permission to delete this post");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching post: ", error);
                });
        } catch (error) {
            console.error("Error updating post: ", error);
        }
    };

    return (
        <Box sx={{ color: "black" }}>
            <Loading
                openLoading={openLoading}
            />
            <Box sx={styleBox}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={props.closeAdd}>
                        <CancelIcon />
                    </IconButton>
                </Box>
                <Typography id="modal-modal-title" variant="h5">
                    Edit an event
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

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={locations}
                        value={location}
                        onChange={handleChangeLocation}
                        isOptionEqualToValue={(option, value) => option === value}
                        sx={{ width: "100%", mb: 1 }}
                        renderInput={(params) => <TextField {...params} label="Locations" />}
                    />
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
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            hidden
                            accept="*"
                        />

                        <Box sx={{
                            p: 1, display: "flex", justifyContent: "center", textAlign: "center",
                            cursor: "pointer", "&:hover": { backgroundColor: "#CCCCCC" },
                            border: "1px solid #C5C5C5", borderRadius: "5px"
                        }}>
                            <Box sx={{ flexDirection: "column" }}>
                                <Box>
                                    <AddAPhotoIcon />
                                </Box>
                                <Box>
                                    Add cover photo
                                </Box>
                            </Box>

                        </Box>
                    </FormControl>
                </Box>
                <Box
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
                        onClick={props.closeAdd}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditEvent}
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
                </Box>
                {previewImages == "" ? (
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
                            <ImageListItem>
                                <img src={props.imageUrls.find((item) => item.includes(oldPicture))} alt={`Preview`} loading="lazy" />
                            </ImageListItem>
                        </ImageList>
                    </Box>
                ) : (
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
                            <ImageListItem>
                                <img src={previewImages} alt={`Preview`} loading="lazy" />
                            </ImageListItem>
                        </ImageList>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
