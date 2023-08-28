import { useState, SyntheticEvent, ChangeEvent, useEffect } from "react";
import { Box, Modal, IconButton, Typography, TextField } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { styleChatList } from "../../utils/styleBox";
import { User } from "../../interface/User";
import {
    collection,
    where,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IGroup } from "../../interface/Group";
import UserCard from "../RightSide/UserCard";
import { themeApp } from "../../utils/Theme";
import ChatBox from "../Chat/ChatBox";
import GroupChatBox from "../GroupChat/GroupChatBox";

interface IData {
    openChatList: boolean;
    handleCloseChatList: () => void;
}

export default function ChatLists(props: IData) {
    const [value, setValue] = useState("1");
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [otherMembers, setOtherMembers] = useState<User[]>([]);
    const [userId, setUserId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const [openChat, setOpenChat] = useState(false);
    const [searchValue, setSearchValue] = useState("");

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
        setSearchValue(value);
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
    const handleChange = (_event: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <>
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
            <Modal open={props.openChatList} onClose={props.handleCloseChatList}>
                <Box sx={styleChatList}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <IconButton onClick={props.handleCloseChatList}>
                            <CancelIcon />
                        </IconButton>
                    </Box>

                    <TabContext value={value}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                justifyContent: "space-between",
                                display: "flex",
                                alignItems: "center",
                                [themeApp.breakpoints.down("md")]: {
                                    flexDirection: "column",
                                },
                            }}
                        >
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab
                                    label="Friends"
                                    value="1"
                                    sx={{
                                        fontSize: "20px",
                                    }}
                                />
                                <Tab
                                    label="Groups"
                                    value="2"
                                    sx={{
                                        fontSize: "20px",
                                    }}
                                />
                            </TabList>
                            <Box sx={{
                                display: "flex", justifyContent: "center"
                            }}>
                                <TextField
                                    id="outlined-size-small"
                                    size="small"
                                    sx={{
                                        m: 1, width: "25vh", [themeApp.breakpoints.down("md")]: {
                                            width: "90%",
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: <SearchIcon />,
                                    }}
                                    placeholder="Search for chating"
                                    onChange={handleSearch}
                                    value={searchValue}
                                />
                            </Box>
                        </Box>
                        <TabPanel value="1">
                            <Box sx={{ minheight: "200px", maxHeight: "400px", overflow: "auto" }}>
                                {inFoUser.some((user) => user.friendList?.length !== 0) ? (
                                    <Box>
                                        {inFoUser.map((user) =>
                                            user.friendList
                                                ?.filter((item) =>
                                                    searchValue
                                                        ? otherMembers.some(
                                                            (other) =>
                                                                other.uid == item.friendId &&
                                                                other.firstName.includes(searchValue)
                                                        )
                                                        : otherMembers.some(
                                                            (other) => other.uid == item.friendId
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
                                    <Typography sx={{ p: 1 }}>You have no friend</Typography>
                                )}
                            </Box>
                        </TabPanel>
                        <TabPanel value="2">
                            <Box sx={{ minheight: "200px", maxHeight: "400px", overflow: "auto" }}>
                                {groupData.some(
                                    (group) =>
                                        group.members.some((member) => member == userInfo.uid) ||
                                        group.hostId == userInfo.uid
                                ) ? (
                                    <Box>
                                        {groupData
                                            .filter((item) =>
                                                searchValue
                                                    ? (item.members.some(
                                                        (member) => member == userInfo.uid
                                                    ) ||
                                                        item.hostId == userInfo.uid) &&
                                                    item.groupName.includes(searchValue)
                                                    : item.members.some(
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
                        </TabPanel>
                    </TabContext>
                </Box>
            </Modal>
        </>

    );
}
