import { useState, ChangeEvent } from "react";
import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Box,
    Typography,
    Autocomplete
} from "@mui/material";
import { User } from "../../interface/User";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
    updateDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { styleEditProfile } from "../../utils/styleBox";
import { themeApp } from "../../utils/Theme";
import PopupAlert from "../PopupAlert";
import { faculties } from "../../helper/Faculties";

interface Ihandle {
    closeEdit: () => void;
}
interface IData {
    userId?: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    aboutMe: string;
    faculty: string;
    instagram: string;
    statusDefault?: string;
    yearDefault?: string;
}

export default function BasicModal(props: Ihandle & IData) {
    const initialState = {
        uid: "",
        username: props.username,
        firstName: props.firstName,
        lastName: props.lastName,
        email: props.email,
        profilePhoto: "",
        coverPhoto: "",
        year: "",
        aboutMe: props.aboutMe,
        faculty: props.faculty,
        instagram: props.instagram,
    };

    const [profile, setProfile] = useState<User>(initialState);
    const [year, setYear] = useState(props.yearDefault);
    const [status, setStatus] = useState(props.statusDefault);
    const [faculty, setFaculty] = useState(props.faculty);

    const clearState = () => {
        setProfile({ ...initialState });
    };

    const handleChangeProfile = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setProfile((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value as string);
    };

    const handleChangeStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const handleEditProfile = async () => {
        const updatedProfile = {
            username: profile.username ?? "",
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            email: profile.email ?? "",
            aboutMe: profile.aboutMe ?? "",
            faculty: faculty ?? "",
            instagram: profile.instagram ?? "",
            status: status ?? "",
            year: year ?? 0,
        };
        console.log(props.userId, updatedProfile);
        try {
            const q = query(
                collection(dbFireStore, "users"),
                where("uid", "==", props.userId)
            );
            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];

            if (doc.exists()) {
                await updateDoc(doc.ref, updatedProfile);
                clearState();
                props.closeEdit();
                PopupAlert("Edited profile successfully", "success");
            } else {
                console.log("Profile does not exist");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    const handleChangeFaclty = (
        _event: ChangeEvent<unknown>,
        newValue: string | null
    ) => {
        if (newValue) {
            setFaculty(newValue);
        }
    };

    return (
        <div style={{ color: "black" }}>
            <Box sx={styleEditProfile}>
                <Typography id="modal-modal-title" variant="h5">
                    Edit Profile
                </Typography>
                <Divider sx={{ background: "grey" }} />
                <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                            sx={{ width: 400, mb: 1 }}
                            id="outlined-basic"
                            label="FirstName"
                            variant="outlined"
                            name="firstName"
                            onChange={handleChangeProfile}
                            value={profile.firstName}
                        />
                        <TextField
                            sx={{ width: 400, mb: 1 }}
                            id="outlined-basic"
                            label="LastName"
                            variant="outlined"
                            name="lastName"
                            onChange={handleChangeProfile}
                            value={profile.lastName}
                        />
                    </Box>
                    <TextField
                        sx={{
                            width: 400, mb: 1, [themeApp.breakpoints.down("md")]: {
                                width: 300,
                            },
                        }}
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        name="username"
                        onChange={handleChangeProfile}
                        value={profile.username}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Year</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                value={year}
                                onChange={handleChangeYear}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Age"
                                onChange={handleChangeStatus}
                            >
                                <MenuItem value={"Single"}>Single</MenuItem>
                                <MenuItem value={"In relationship"}>In relationship</MenuItem>
                                <MenuItem value={"Undefined"}>Undefined</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={faculties}
                        value={faculty}
                        onChange={handleChangeFaclty}
                        isOptionEqualToValue={(option, value) => option === value}
                        sx={{ width: "100%", mt: 1, mb: 1 }}
                        renderInput={(params) => <TextField {...params} label="Faclties" />}
                    />
                    <TextField
                        multiline
                        sx={{
                            width: 400, mb: 1, [themeApp.breakpoints.down("md")]: {
                                width: 300,
                            }
                        }}
                        id="outlined-basic"
                        label="About me"
                        variant="outlined"
                        name="aboutMe"
                        onChange={handleChangeProfile}
                        value={profile.aboutMe}
                    />
                    <TextField
                        sx={{
                            width: 400, mb: 1, [themeApp.breakpoints.down("md")]: {
                                width: 300,
                            }
                        }}
                        id="outlined-basic"
                        label="IG"
                        variant="outlined"
                        name="instagram"
                        onChange={handleChangeProfile}
                        value={profile.instagram}
                    />
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
                        onClick={props.closeEdit}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "#8E51E2",
                            color: "white",
                            "&:hover": {
                                color: "black",
                                backgroundColor: "#E1E1E1",
                            },
                        }}
                        onClick={handleEditProfile}
                        type="submit"
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
