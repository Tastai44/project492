import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { dbFireStore, storage } from "../../config/firebase";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";
import { handleAddFriend } from "../Functions/AddUnFriend";
import { ref, listAll, getDownloadURL, StorageReference } from "firebase/storage";

interface IData {
    username: string;
    profilePhoto: string;
    uId: string;
}

export default function MemberCard(props: IData) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [user, setUser] = useState<User[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchUSerData = async () => {
            try {
                const queryData = query(
                    collection(dbFireStore, "users"),
                    where("uid", "==", userInfo.uid)
                );
                const querySnapshot = await getDocs(queryData);
                const queriedData = querySnapshot.docs.map((doc) => doc.data() as User);
                setUser(queriedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchUSerData();
    }, [user, userInfo.uid]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const listRef: StorageReference = ref(storage, '/Images');
                const res = await listAll(listRef);
                const urls = await Promise.all(
                    res.items.map(async (itemRef) => {
                        const imageUrl = await getDownloadURL(itemRef);
                        return imageUrl;
                    })
                );
                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchImages();
    }, []);

    return (
        <Card sx={{ width: 250, borderRadius: "20px" }}>
            <CardActions
                disableSpacing
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    background: "white",
                }}
            >
                <Button
                    sx={{
                        fontSize: "14px",
                        color: "white",
                        borderRadius: "5px",
                        backgroundColor: "#A005FF",
                        "&:hover": { color: "black", backgroundColor: "#F1F1F1" },
                    }}
                    onClick={() => handleAddFriend(props.uId, userInfo.uid)}
                >
                    Add Friend
                </Button>
                <NavLink to={`/profileBlog/${props.uId}`}>
                    <Button
                        sx={{
                            color: "white",
                            borderRadius: "5px",
                            backgroundColor: "grey",
                            "&:hover": { backgroundColor: "#F1F1F1", color: "black" },
                        }}
                    >
                        View
                    </Button>
                </NavLink>
            </CardActions>
            {props.profilePhoto ? (
                <CardMedia
                    component="img"
                    height="194"
                    image={imageUrls.find((item) => item.includes(props.profilePhoto))}
                    alt="userPicture"
                />
            ) : (
                <Box sx={{ width: "100%", backgroundColor: "primary.contrastText" }}>
                    <AccountBoxIcon sx={{ fontSize: "200px", color: "white" }} />
                </Box>
            )}

            <CardContent>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "20px", textAlign: "center" }}
                >
                    {props.username}
                </Typography>
            </CardContent>
        </Card>
    );
}
