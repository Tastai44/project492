import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import MemberCard from "./MemberCard";
import { User } from "../../interface/User";
import { collection, query, orderBy, where, onSnapshot, getDocs } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../helper/SearchBar";

export default function MembersCon() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [otherMembers, setOtherMembers] = useState<User[]>([]);
    const [user, setUser] = useState<User[]>([]);
    const [searchValue, setValue] = useState("");

    useEffect(() => {
        const fetchMemberData = query(
            collection(dbFireStore, "users"),
            where("uid", "!=", userInfo.uid),
            orderBy("uid"),
            orderBy("firstName", "desc")
        );
        const unsubscribeOther = onSnapshot(
            fetchMemberData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setOtherMembers(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribeOther();
        };

    }, [user, otherMembers, userInfo.uid]);

    useEffect(() => {
        const fetchUserData = async () => {
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
        fetchUserData();
    }, [userInfo.uid]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", gap: 5, color: "black" }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "end",
                }}
            >
                <Typography
                    sx={{ fontSize: "30px", color: "primary.main", fontWeight: 500 }}
                >
                    People who you may know
                </Typography>
                <SearchBar
                    searchValue={searchValue}
                    handleSearch={handleSearch}
                />
            </Box>
            <Grid sx={{ flexGrow: 1, gap: "30px" }} container>
                {otherMembers
                    .filter(
                        (f) =>
                            !user.some((m) => m.friendList?.some((s) => f.uid === s.friendId))
                    )
                    .map((otherUser) => (
                        <MemberCard
                            key={otherUser.uid}
                            username={`${otherUser.firstName} ${otherUser.lastName}`}
                            profilePhoto={
                                otherUser.profilePhoto ? otherUser.profilePhoto : ""
                            }
                            uId={otherUser.uid}
                        />
                    ))}
            </Grid>
        </Box>
    );
}
