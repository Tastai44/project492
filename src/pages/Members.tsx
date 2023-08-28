import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import {
    collection,
    query,
    where,
    onSnapshot,
    getDocs,
} from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import MemberCard from "../components/Members/MemberCard";
import { dbFireStore } from "../config/firebase";
import SearchBar from "../helper/SearchBar";
import { themeApp } from "../utils/Theme";
import { User } from "../interface/User";

export default function Members() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [otherMembers, setOtherMembers] = useState<User[]>([]);
    const [user, setUser] = useState<User[]>([]);
    const [searchValue, setValue] = useState("");
    const [reFresh, setReFresh] = useState("");

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "!=", userInfo.uid)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setOtherMembers(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [userInfo.uid, reFresh]);

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
    }, [userInfo.uid, reFresh]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    const handleRefresh = () => {
        setReFresh((pre) => pre + 1);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                color: "black",
                [themeApp.breakpoints.down("md")]: {
                    justifyContent: "center"
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "end",
                    [themeApp.breakpoints.down("md")]: {
                        justifyContent: "center",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        [themeApp.breakpoints.down("md")]: {
                            textAlign: "center",
                            flexDirection: "column",

                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "30px",
                            color: "primary.main",
                            fontWeight: 500,
                        }}
                    >
                        People who you may know
                    </Typography>
                    <SearchBar searchValue={searchValue} handleSearch={handleSearch} />
                </Box>
            </Box>
            {searchValue == "" ? (
                <Grid sx={{ flexGrow: 1, gap: "30px" }} container>
                    {otherMembers
                        .filter(
                            (f) =>
                                !user.some((m) =>
                                    m.friendList?.some((s) => f.uid === s.friendId)
                                )
                        )
                        .map((otherUser) => (
                            <MemberCard
                                key={otherUser.uid}
                                username={`${otherUser.firstName} ${otherUser.lastName}`}
                                profilePhoto={
                                    otherUser.profilePhoto ? otherUser.profilePhoto : ""
                                }
                                uId={otherUser.uid}
                                handleRefresh={handleRefresh}
                            />
                        ))}
                </Grid>
            ) : (
                <Grid sx={{ flexGrow: 1, gap: "30px" }} container>
                    {otherMembers
                        .filter(
                            (f) =>
                                !user.some((m) =>
                                    m.friendList?.some((s) => f.uid === s.friendId)
                                ) &&
                                (f.firstName.includes(searchValue) ||
                                    f.lastName.includes(searchValue))
                        )
                        .map((otherUser) => (
                            <MemberCard
                                key={otherUser.uid}
                                username={`${otherUser.firstName} ${otherUser.lastName}`}
                                profilePhoto={
                                    otherUser.profilePhoto ? otherUser.profilePhoto : ""
                                }
                                uId={otherUser.uid}
                                handleRefresh={handleRefresh}
                            />
                        ))}
                </Grid>
            )}
        </Box>
    );
}
