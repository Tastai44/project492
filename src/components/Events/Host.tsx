import { useState, useEffect } from "react";
import { Paper, Divider, CardMedia, Box } from "@mui/material";
import { collection, query, getDocs, where } from "firebase/firestore";
import { User } from "../../interface/User";
import { dbFireStore } from "../../config/firebase";
import { NavLink } from "react-router-dom";

interface IData {
    hostId: string;
    imageUrls: string[];
}
export default function Host({ hostId, imageUrls }: IData) {
    const [inFoUser, setInFoUser] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(
                    collection(dbFireStore, "users"),
                    where("uid", "==", hostId)
                );
                const querySnapshot = await getDocs(q);
                const queriedData = querySnapshot.docs.map(
                    (doc) =>
                    ({
                        uid: doc.id,
                        ...doc.data(),
                    } as User)
                );
                setInFoUser(queriedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [hostId]);

    return (
        <div>
            {inFoUser.map((u) => (
                <Paper key={u.uid} sx={{ borderRadius: "10px", height: "310px" }}>
                    <NavLink to={`/profileBlog/${u.uid}`} style={{ color: "black" }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Box sx={{ p: 1, fontSize: "20px", fontWeight: "bold" }}>
                                Host
                            </Box>
                        </Box>
                        <Divider light />
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 200, m: 1, height: 200, borderRadius: "10px" }}
                                image={imageUrls.find((item) => item.includes(u.profilePhoto ?? ""))}
                                alt="Host"
                            />
                        </Box>
                        <Divider light />
                        <Box sx={{ m: 1, fontSize: "18px", textAlign: "center" }}>
                            {u.firstName} {u.lastName}
                        </Box>
                    </NavLink>
                </Paper>
            ))}
        </div>
    );
}
