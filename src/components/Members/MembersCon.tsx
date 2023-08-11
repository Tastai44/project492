import * as React from "react";
import Grid from "@mui/material/Grid";
import MemberCard from "./MemberCard";
import { User } from "../../interface/User";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { Box, Typography } from "@mui/material";
import {
    Search,
    SearchIconWrapper,
    StyledInputBase,
} from "../../components/Navigation";
import SearchIcon from "@mui/icons-material/Search";

export default function MembersCon() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [otherMembers, setOtherMembers] = React.useState<User[]>([]);
    const [user, setUser] = React.useState<User[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const queryData = query(
                    collection(dbFireStore, "users"),
                    where("uid", "!=", userInfo.uid),
                    orderBy("uid"),
                    orderBy("firstName", "desc")
                );
                const querySnapshot = await getDocs(queryData);
                const queriedData = querySnapshot.docs.map((doc) => doc.data() as User);
                setOtherMembers(queriedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
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
        fetchData();
    }, [userInfo.uid, user, otherMembers]);

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
                <Search
                    sx={{
                        backgroundColor: "#F1F1F1",
                        m: 1,
                        "&:hover": { backgroundColor: "#C5C5C5" },
                    }}
                >
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                    />
                </Search>
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
