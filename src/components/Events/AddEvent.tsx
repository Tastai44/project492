import { useState, useEffect, useRef, ChangeEvent } from "react";
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
import { EventPost } from "../../interface/Event";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";

import "firebase/database";
import { dbFireStore, storage } from "../../config/firebase";
import {
    collection,
    setDoc,
    doc,
    onSnapshot,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import { locations } from "../../helper/CMULocations";
import { createNoti } from "../Functions/NotificationFunction";
import { User } from "../../interface/User";
import { styleBox } from "../../utils/styleBox";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { ref, uploadBytes } from "firebase/storage";
import heic2any from "heic2any";
import Loading from "../Loading";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";
import { validExtensions } from "../../helper/ImageLastName";
import { resizeImage } from "../Functions/ResizeImage";

interface Ihandle {
    closeAdd: () => void;
}

export default function AddEvent({ closeAdd }: Ihandle) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [status, setStatus] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [location, setLocation] = useState("");
    const [previewImages, setPreviewImages] = useState<string>('');
    const [openLoading, setLopenLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null);
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
        location: "",
        createAt: "",
        shareUsers: [],
        reportEvent: [],
    };
    const [event, setEvent] = useState<EventPost>(initialState);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", userInfo.uid)
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
    }, [userInfo.uid]);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpload = async () => {
        setLopenLoading(true);
        if (imageUpload == null) return;
        const resizedImage = await resizeImage(imageUpload, 800, 600);
        const fileName = removeSpacesBetweenWords(imageUpload.name);
        const imageRef = ref(storage, `Images/event_${userInfo.uid}${fileName}`);
        uploadBytes(imageRef, resizedImage).then(() => {
            createEvent(`event_${userInfo.uid}${fileName}`);
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const fileName = fileInput.value;
        const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        const reader = new FileReader();
        const isExtensionValid = validExtensions.includes(fileNameExt.toLowerCase());

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
        } else if (isExtensionValid) {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) {
                reader.onloadend = () => {
                    setPreviewImages(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
                setImageUpload(selectedFile);
            }
        } else {
            PopupAlert("Sorry, this website can only upload picture", "warning");
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const handleClearImage = () => {
        setPreviewImages('');
    };

    const clearState = () => {
        setEvent({ ...initialState });
        handleClearImage();
    };
    const handleChangeEvent = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleChangeLocation = (
        _event: ChangeEvent<unknown>,
        newValue: string | null
    ) => {
        if (newValue) {
            setLocation(newValue);
        }
    };

    const createEvent = async (picPath: string) => {
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
            coverPhoto: removeSpacesBetweenWords(picPath),
            status: status,
            interest: [],
            shareUsers: [],
            location: location,
            reportEvent: [],
            createAt: new Date().toLocaleString(),
            dateCreated: serverTimestamp(),
            owner: userInfo.uid,
        };

        try {
            const docRef = doc(eventCollection);
            const eventId = docRef.id;
            const updatedEvent = { ...newEvent, eventId: eventId };
            await setDoc(docRef, updatedEvent);
            if (inFoUser.flatMap((user) => user.friendList).length !== 0) {
                createNoti(
                    eventId,
                    ` created an event ${event.title}`,
                    userInfo.uid, status,
                    [
                        ...inFoUser.flatMap((user) =>
                            user.friendList?.flatMap((friend) => friend.friendId) || []
                        )
                    ]
                );
            }

            setEvent(updatedEvent);
            clearState();
            closeAdd();
            PopupAlert("Added an event successfully", "success");
            setLopenLoading(false);
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    return (
        <div style={{ color: "black" }}>
            <Loading
                openLoading={openLoading}
            />
            <Box sx={styleBox}>
                <Typography id="modal-modal-title" variant="h5">
                    Create an event
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
                        renderInput={(params) => (
                            <TextField {...params} label="Locations" />
                        )}
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
                        onClick={handleUpload}
                        sx={{
                            backgroundColor: "#8E51E2",
                            color: "white",
                            "&:hover": {
                                color: "black",
                                backgroundColor: "#E1E1E1",
                            },
                        }}
                        type="submit"
                        disabled={!previewImages || !event.title || !event.details || !event.topic || !location || !event.ageRage || !status}
                    >
                        Create
                    </Button>
                </Typography>
                {previewImages !== '' && (
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
        </div>
    );
}
