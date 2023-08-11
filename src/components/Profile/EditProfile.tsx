import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React from "react";
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

export default function BasicModal({
    userId,
    username,
    firstName,
    lastName,
    email,
    aboutMe,
    faculty,
    instagram,
    statusDefault,
    yearDefault,
    closeEdit,
}: Ihandle & IData) {
    const initialState = {
        uid: "",
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePhoto: "",
        coverPhoto: "",
        aboutMe: aboutMe,
        faculty: faculty,
        instagram: instagram,
    };
    const [profile, setProfile] = React.useState<User>(initialState);
    const clearState = () => {
        setProfile({ ...initialState });
    };

    const handleChangeProfile = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setProfile((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };
    const [year, setYear] = React.useState(yearDefault);
    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value as string);
    };
    const [status, setStatus] = React.useState(statusDefault);
    const handleChangeStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const handleEditProfile = async () => {
        const updatedProfile = {
            username: profile.username,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            aboutMe: profile.aboutMe,
            faculty: profile.faculty,
            instagram: profile.instagram,
            status: status,
            year: year,
        };

        try {
            const q = query(
                collection(dbFireStore, "users"),
                where("uid", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];

            if (doc.exists()) {
                await updateDoc(doc.ref, updatedProfile);
                clearState();
                closeEdit();
            } else {
                console.log("Profile does not exist");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    return (
        <div style={{ color: "black" }}>
            <Box sx={style}>
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
                        sx={{ width: 400, mb: 1 }}
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

                        <FormControl fullWidth sx={{ mb: 1 }}>
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
                    <TextField
                        sx={{ width: 400, mb: 1 }}
                        id="outlined-basic"
                        label="Faculty"
                        variant="outlined"
                        name="faculty"
                        onChange={handleChangeProfile}
                        value={profile.faculty}
                    />
                    <TextField
                        multiline
                        sx={{ width: 400, mb: 1 }}
                        id="outlined-basic"
                        label="About me"
                        variant="outlined"
                        name="aboutMe"
                        onChange={handleChangeProfile}
                        value={profile.aboutMe}
                    />
                    <TextField
                        sx={{ width: 400, mb: 1 }}
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        name="email"
                        onChange={handleChangeProfile}
                        value={profile.email}
                    />
                    <TextField
                        sx={{ width: 400, mb: 1 }}
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
                        onClick={closeEdit}
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
