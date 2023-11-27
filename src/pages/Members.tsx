import { useState, useEffect, ChangeEvent } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import { Box, Typography, Grid } from "@mui/material";
import MemberCard from "../components/Members/MemberCard";
import { dbFireStore } from "../config/firebase";
import SearchBar from "../helper/SearchBar";
import { themeApp } from "../utils/Theme";
import { User } from "../interface/User";
import Loading from "../components/Loading";

export default function Members() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [otherMembers, setOtherMembers] = useState<User[]>([]);
    const [user, setUser] = useState<User[]>([]);
    const [searchValue, setValue] = useState("");
    const [openLoading, setOpenLoading] = useState(false);

    useEffect(() => {
        setOpenLoading(true);
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "!=", userInfo.uid)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setOtherMembers(queriedData);
                setOpenLoading(false);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [userInfo.uid]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", userInfo.uid)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setUser(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [userInfo.uid]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
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
            <Loading
                openLoading={openLoading}
            />
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
                            width: "50%"
                        }}
                    >
                        People who you may know
                    </Typography>
                    <Box sx={{
                        width: "20%",
                        [themeApp.breakpoints.down("md")]: {
                            width: "100%",
                        },
                    }}>
                        <SearchBar
                            searchValue={searchValue}
                            handleSearch={handleSearch}
                            backgroupColor={'white'}
                        />
                    </Box>


                </Box>
            </Box>
            {searchValue == "" ? (
                <Grid sx={{
                    flexGrow: 1, gap: "30px", [themeApp.breakpoints.down("md")]: {
                        justifyContent: "center",
                    },
                }} container >
                    {otherMembers
                        .filter(
                            (member) =>
                                !user.some((u) =>
                                    u.friendList?.some((s) => member.uid == s.friendId)
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
                                    f.lastName.includes(searchValue) ||
                                    f.faculty.includes(searchValue)
                                    || f.year == searchValue
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
                            />
                        ))}
                </Grid>
            )}
        </Box>
    );
}
