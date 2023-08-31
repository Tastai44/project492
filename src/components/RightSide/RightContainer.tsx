import { ChangeEvent, useEffect, useState } from "react";
import { Button, Divider, Modal, TextField, Typography, Paper, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UserCard from "./UserCard";
import "firebase/database";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";
import { IGroup } from "../../interface/Group";
import ChatBox from "../Chat/ChatBox";
import GroupChatBox from "../GroupChat/GroupChatBox";

export default function RightContainer() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [otherMembers, setOtherMembers] = useState<User[]>([]);
    const [userId, setUserId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const [openChat, setOpenChat] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [searchValue, setValue] = useState("");
    const [searchGroupValue, setGroupValue] = useState("");

    const handleIsActive = (value: boolean) => {
        setIsActive(value);
    };

    const handleOpenChat = (id: string) => {
        setOpenChat(true);
        setUserId(id);
    };
    const handleCloseChat = () => setOpenChat(false);

    const [openGroupChat, setOpenGroupChat] = useState(false);
    const handleOpenGroupChat = (id: string) => {
        setOpenGroupChat(true);
        setGroupId(id);
    };
    const handleCloseGroupChat = () => setOpenGroupChat(false);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };
    const handleGroupSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setGroupValue(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(
                    collection(dbFireStore, "users"),
                    where("uid", "==", userInfo.uid)
                );
                onSnapshot(q, (querySnapshot) => {
                    const queriedData = querySnapshot.docs.map(
                        (doc) =>
                        ({
                            uid: doc.id,
                            ...doc.data(),
                        } as User)
                    );
                    setInFoUser(queriedData);
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchGroupData = async () => {
            try {
                const q = query(collection(dbFireStore, "groups"));
                onSnapshot(q, (querySnapshot) => {
                    const queriedData = querySnapshot.docs.map(
                        (doc) => doc.data() as IGroup
                    );
                    setGroupData(queriedData);
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchGroupData();
        fetchData();
    }, [userInfo.uid]);

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
    }, [userInfo.uid]);

    console.log(inFoUser);

    return (
        <Box sx={{ width: "100%", display: { xs: "none", lg: "flex" } }}>
            <Modal
                open={openChat}
                onClose={handleCloseChat}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <ChatBox uId={userId} handleClose={handleCloseChat} />
                </Box>
            </Modal>
            <Modal
                open={openGroupChat}
                onClose={handleCloseGroupChat}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <GroupChatBox groupId={groupId} handleClose={handleCloseGroupChat} />
                </Box>
            </Modal>
            <Box sx={{ width: "100%", mr: 5 }}>
                <Paper sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "start",
                            fontSize: "18px",
                            fontWeight: "bold",
                            padding: 1,
                        }}
                    >
                        Friend
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }} >
                        <TextField
                            id="outlined-size-small"
                            size="small"
                            sx={{ m: 1, width: "25vh" }}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            placeholder="Search for friend"
                            onChange={handleSearch}
                            value={searchValue}
                        />
                    </Box>
                    <Divider style={{ background: "#EAEAEA", marginBottom: 5 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-around", mb: 0.5 }}>
                        <Button
                            onClick={() => handleIsActive(true)}
                            sx={{
                                color: isActive ? "white" : "black",
                                backgroundColor: isActive ? "primary.main" : "",
                                cursor: "pointer",
                                "&:hover": { color: isActive ? "black" : "black" }
                            }}
                        >
                            Active
                        </Button>
                        <Button
                            onClick={() => handleIsActive(false)}
                            sx={{
                                color: isActive ? "black" : "white",
                                backgroundColor: isActive ? "" : "primary.main",
                                cursor: "pointer",
                                "&:hover": { color: isActive ? "black" : "black" }
                            }}
                        >
                            General
                        </Button>
                    </Box>
                    <Divider style={{ background: "#EAEAEA", marginBottom: 5 }} />
                    {isActive ? (
                        <Box>
                            {inFoUser.some((user) => user.friendList?.length !== 0) ? (
                                <Box sx={{ minHeight: "60px", maxHeight: "180px", overflow: "auto" }}>
                                    {inFoUser.map((user) =>
                                        user.friendList
                                            ?.filter((item) => (searchValue ?
                                                otherMembers.some(
                                                    (other) =>
                                                        other.uid == item.friendId && other.isActive && other.firstName.includes(searchValue)
                                                ) : otherMembers.some(
                                                    (other) =>
                                                        other.uid == item.friendId && other.isActive
                                                ))
                                            )
                                            .map((friend) => (
                                                <Box
                                                    onClick={() => handleOpenChat(friend.friendId)}
                                                    sx={{ cursor: "pointer" }}
                                                    key={friend.friendId}
                                                >
                                                    <UserCard userId={friend.friendId} />
                                                </Box>
                                            ))
                                    )}
                                </Box>
                            ) : (
                                <Typography sx={{ p: 1 }}>You have no friend</Typography>
                            )}
                        </Box>
                    ) : (
                        <Box>
                            {inFoUser.some((user) => user.friendList?.length !== 0) ? (
                                <Box sx={{ minHeight: "60px", maxHeight: "180px", overflow: "auto" }} >
                                    {inFoUser.map((user) =>
                                        user.friendList?.filter((item) => searchValue ?
                                            otherMembers.some(
                                                (other) =>
                                                    other.uid == item.friendId && other.firstName.includes(searchValue)
                                            ) : otherMembers.some(
                                                (other) =>
                                                    other.uid == item.friendId
                                            )).map((friend) => (
                                                <Box
                                                    onClick={() => handleOpenChat(friend.friendId)}
                                                    sx={{ cursor: "pointer" }}
                                                    key={friend.friendId}
                                                >
                                                    <UserCard userId={friend.friendId} />
                                                </Box>
                                            ))
                                    )}
                                </Box>
                            ) : (
                                <Typography sx={{ p: 1 }}>You have no friend</Typography>
                            )}
                        </Box>
                    )}
                </Paper>

                <Paper sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "start",
                            fontSize: "18px",
                            fontWeight: "bold",
                            padding: 1,
                        }}
                    >
                        Groups
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                            id="outlined-size-small"
                            size="small"
                            sx={{ m: 1, width: "25vh" }}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            placeholder="Search for group"
                            onChange={handleGroupSearch}
                            value={searchGroupValue}
                        />
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        {/* <Button sx={{ color: "black" }}>Active</Button>
						<Button sx={{ color: "black" }}>General</Button> */}
                    </div>
                    <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
                    <Box>
                        {groupData.some(
                            (group) =>
                                group.members.some(
                                    (member) => member == userInfo.uid
                                ) || group.hostId == userInfo.uid
                        ) ? (
                            <Box sx={{ minHeight: "60px", maxHeight: "180px", overflow: "auto" }}>
                                {groupData
                                    .filter(
                                        (item) => searchGroupValue ?
                                            (item.members.some(
                                                (member) => member == userInfo.uid
                                            ) || item.hostId == userInfo.uid) && item.groupName.includes(searchGroupValue) :
                                            item.members.some(
                                                (member) => member == userInfo.uid
                                            ) || item.hostId == userInfo.uid
                                    )
                                    .map((group) => (
                                        <Box
                                            onClick={() => handleOpenGroupChat(group.gId)}
                                            sx={{ cursor: "pointer" }}
                                            key={group.gId}
                                        >
                                            <UserCard
                                                username={group.groupName}
                                                profilePhoto={group.coverPhoto}
                                                members={group.members}
                                            />
                                        </Box>
                                    ))}
                            </Box>
                        ) : (
                            <Typography sx={{ p: 1 }}>You have no group</Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
