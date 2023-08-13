import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Button, Divider, Modal, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

export default function RightContainer() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [otherMembers, setOtherMembers] = useState<User[]>([]);
    const [userId, setUserId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const [openChat, setOpenChat] = useState(false);
    const [isActive, setIsActive] = useState(false);

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

    return (
        <Box sx={{ width: "100%" }}>
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
            <Stack spacing={2}>
                <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                    <Box>
                        <TextField
                            id="outlined-size-small"
                            size="small"
                            sx={{ m: 1, width: "25vh" }}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            placeholder="Search for friend"
                        />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
                        <Button
                            onClick={() => handleIsActive(true)}
                            sx={{
                                color: isActive ? "white" : "black",
                                backgroundColor: isActive ? "primary.main" : "",
                                cursor: "pointer",
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
                            }}
                        >
                            General
                        </Button>
                    </Box>
                    <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
                    {isActive ? (
                        <Box>
                            {inFoUser.some((user) => user.friendList?.length !== 0) ? (
                                <Box>
                                    {inFoUser.map((user) =>
                                        user.friendList
                                            ?.filter((item) =>
                                                otherMembers.some(
                                                    (other) =>
                                                        other.uid == item.friendId && other.isActive
                                                )
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
                                <Typography>You have no friend</Typography>
                            )}
                        </Box>
                    ) : (
                        <Box>
                            {inFoUser.some((user) => user.friendList?.length !== 0) ? (
                                <Box>
                                    {inFoUser.map((user) =>
                                        user.friendList?.map((friend) => (
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
                                <Typography>You have no friend</Typography>
                            )}
                        </Box>
                    )}
                </Item>

                <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                    <Box>
                        <TextField
                            id="outlined-size-small"
                            size="small"
                            sx={{ m: 1, width: "25vh" }}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            placeholder="Search for group"
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
                                    (member) => member.memberId == userInfo.uid
                                ) || group.hostId == userInfo.uid
                        ) ? (
                            <Box>
                                {groupData
                                    .filter(
                                        (item) =>
                                            item.members.some(
                                                (member) => member.memberId == userInfo.uid
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
                            <Typography>You have no group</Typography>
                        )}
                    </Box>
                </Item>
            </Stack>
        </Box>
    );
}
