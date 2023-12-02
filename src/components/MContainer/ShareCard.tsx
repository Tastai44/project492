import { useState, ChangeEvent, useEffect } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { styleTable } from "../../utils/styleBox";
import {
    Avatar,
    Button,
    Typography,
    Divider,
    Modal,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Box
} from "@mui/material";
import { IFriendList, User } from "../../interface/User";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { collection, updateDoc, doc, arrayUnion, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import SearchBar from "../../helper/SearchBar";
import { createNoti } from "../NotificationFunction";
import { Post } from "../../interface/PostContent";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { IGroup, IShare } from "../../interface/Group";
import { themeApp } from "../../utils/Theme";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "uid" },
    {
        field: "profilePhoto",
        headerName: "Profile Photo",
        renderCell: (params) => (
            <Avatar
                src={params.value}
                alt={`Profile of ${params.row.username}`}
                style={{ width: "50px", height: "50px" }}
            />
        ),
        width: 150,
        flex: 1,
    },
    {
        field: "username",
        headerName: "Full Name",
        width: 150,
        flex: 1,
    },
];

interface IData {
    friendList: IFriendList[];
    openShare: boolean;
    postId?: string;
    postCaption?: string;
    eventId?: string;
}
interface IFunction {
    handleCloseShare: () => void;
    imageUrls: string[];
}

export default function ShareCard(props: IData & IFunction) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [searchValue, setValue] = useState("");
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const [status, setStatus] = useState("Private");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [rows, setRows] = useState<IShare[]>([]);
    const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

    useEffect(() => {
        const fetchData = query(
            collection(dbFireStore, "groups"),
            where("members", "array-contains", userInfo.uid),
            orderBy("createAt", "desc")
        );
        const unsubscribe = onSnapshot(
            fetchData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as IGroup);
                setGroupData(queriedData);
            },
            (error) => {
                console.error("Error fetching data", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [userInfo.uid]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setInFoUser(queriedData);
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
        if (status == "Friend") {
            const rows = inFoUser.filter((user) => props.friendList.some((friend) => friend.friendId == user.uid)).map((row, index) => ({
                id: `${row.uid}_${index}`,
                uid: row.uid,
                username: `${row.firstName} ${row.lastName}`,
                profilePhoto: props.imageUrls.find((item) => item.includes(row.profilePhoto ?? "")),
            }));
            setRows(rows);
        } else if (status == "Group") {
            setRows(groupData.flatMap((group, index) => ({
                id: `${group.gId}_${index}`,
                uid: group.gId,
                username: group.groupName,
                profilePhoto: props.imageUrls.find((item) => item.includes(group.coverPhoto ?? "")),
            })));
        }
    }, [groupData, inFoUser, props.friendList, status, props.imageUrls]);

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const handleSelectionModelChange = (selectionModel: GridRowId[]) => {
        setSelectedRows(selectionModel);
    };

    const handleShare = async () => {
        try {
            const postsCollection = collection(dbFireStore, "posts");
            const postRef = doc(postsCollection, props.postId);
            const getRowsId = selectedRows.map((rowId) => rowId);
            const filterRowsData = rows.filter((row) =>
                getRowsId.includes(row.id ? row.id : "")
            );

            // Check if the post has been shared already by the current user
            const postSnapshot = await getDoc(postRef);
            const postExists = postSnapshot.exists();

            if (!postExists) {
                console.error("Post not found");
                return;
            }

            const post = postSnapshot.data() as Post;

            //Strill wrong
            const existingShareIndex = post.shareUsers.some((share) => (
                (share.shareBy === userInfo.uid && share.shareTo === userInfo.uid) &&
                (status === "Private" || status === "Public")
            ));

            const existingShareFriend = post.shareUsers.some((share) => share.shareBy == userInfo.uid &&
                filterRowsData.some((row) => row.uid == share.shareTo)
            );

            if (existingShareIndex || existingShareFriend) {
                PopupAlert("Share already exists for this user and post", "warning");
                return;
            }
            if (filterRowsData.length > 0 && (status === "Friend" || status === "Group")) {
                try {
                    for (let i = 0; i < filterRowsData.length; i++) {
                        const updateShare = {
                            shareBy: userInfo.uid,
                            shareTo: status === "Friend" || status === "Group" ? filterRowsData[i].uid : "",
                            status: status,
                            createdAt: new Date().toLocaleString(),
                        };
                        createNoti(
                            (props.postId ?? ""), ` shared ${props.postCaption}`, userInfo.uid, status, [filterRowsData[i].uid], filterRowsData[i].uid
                        );
                        await updateDoc(postRef, {
                            participants: arrayUnion(filterRowsData[i].uid),
                            shareUsers: arrayUnion(updateShare),
                        });
                    }
                    props.handleCloseShare();
                    setSelectedRows([]);
                    PopupAlert("Share successfully", "success");
                } catch (error) {
                    console.error("Error share", error);
                }
            } else {
                const updateShare = {
                    shareBy: userInfo.uid,
                    shareTo: userInfo.uid,
                    status: status,
                    createdAt: new Date().toLocaleString(),
                };
                await updateDoc(postRef, {
                    participants: arrayUnion(userInfo.uid),
                    shareUsers: arrayUnion(updateShare),
                });
                createNoti(
                    (props.postId ?? ""), ` shared ${props.postCaption}`, userInfo.uid, status,
                    [
                        ...props.friendList?.flatMap((friend) => friend.friendId) || []
                    ]
                );
                props.handleCloseShare();
                PopupAlert("Share successfully", "success");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };


    const handleShareEvent = async () => {
        try {
            const eventCollection = collection(dbFireStore, "events");
            const getRowsId = selectedRows.map((rowId) => rowId);
            const eventRef = doc(eventCollection, props.eventId);
            const filterRowsData = rows.filter((row) =>
                getRowsId.includes(row.id ? row.id : "")
            );

            // Check if the post has been shared already by the current user
            const eventSnapshot = await getDoc(eventRef);
            const eventExists = eventSnapshot.exists();

            if (!eventExists) {
                console.error("Post not found");
                return;
            }

            const event = eventSnapshot.data() as Post;

            //Strill wrong
            const existingShareIndex = event.shareUsers.some((share) => (
                (share.shareBy === userInfo.uid && share.shareTo === userInfo.uid) &&
                (status === "Private" || status === "Public")
            ));

            const existingShareFriend = event.shareUsers.some((share) => share.shareBy == userInfo.uid &&
                filterRowsData.some((row) => row.uid == share.shareTo)
            );

            if (existingShareIndex || existingShareFriend) {
                PopupAlert("Share already exists for this user and post", "warning");
                return;
            }

            if (filterRowsData.length !== 0) {
                try {
                    for (let i = 0; i < filterRowsData.length; i++) {
                        const updatedEvent = {
                            shareBy: userInfo.uid,
                            shareTo: status === "Friend" || status === "Group" ? filterRowsData[i].uid : "",
                            status: status,
                            createdAt: new Date().toLocaleString(),
                        };
                        const eventRef = doc(eventCollection, props.eventId);
                        await updateDoc(eventRef, {
                            participants: arrayUnion(filterRowsData[i].uid),
                            shareUsers: arrayUnion(updatedEvent),
                        });
                    }
                    props.handleCloseShare();
                    PopupAlert("Share successfully", "success");
                } catch (error) {
                    console.error("Error share", error);
                }
            } else {
                const updatedEvent = {
                    shareBy: userInfo.uid,
                    shareTo: userInfo.uid,
                    status: status,
                    createdAt: new Date().toLocaleString(),
                };
                const eventRef = doc(eventCollection, props.eventId);
                await updateDoc(eventRef, {
                    participants: arrayUnion(userInfo.uid),
                    shareUsers: arrayUnion(updatedEvent),
                });
                props.handleCloseShare();
                PopupAlert("Share successfully", "success");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <Modal open={props.openShare} onClose={props.handleCloseShare}>
            <Box sx={styleTable}>
                <Box
                    sx={{
                        color: "black",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h5"
                        sx={{
                            color: "black", [themeApp.breakpoints.down("md")]: {
                                fontSize: "16px"
                            },
                        }}
                    >
                        Share Lists
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", }}>
                        <FormControl size="small" sx={{ width: "120px" }}>
                            <InputLabel id="demo-simple-select">Status</InputLabel>
                            <Select
                                label="Status"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                onChange={handleChange}
                            >
                                <MenuItem value={"Private"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                            [themeApp.breakpoints.down("md")]: {
                                                fontSize: "14px",
                                                display: "flex",
                                                alignItems: "center"
                                            },
                                        }}
                                    >
                                        <LockIcon sx={{
                                            [themeApp.breakpoints.down("md")]: {
                                                fontSize: "14px"
                                            },
                                        }} /> Private
                                    </Box>
                                </MenuItem>
                                <MenuItem value={"Friend"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <GroupIcon /> Friend
                                    </Box>
                                </MenuItem>
                                <MenuItem value={"Group"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Diversity3Icon /> Group
                                    </Box>
                                </MenuItem>
                                <MenuItem value={"Public"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <PublicIcon /> Public
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{
                            [themeApp.breakpoints.down("md")]: {
                                width: "100px"
                            },
                        }}>
                            <SearchBar
                                searchValue={searchValue}
                                handleSearch={handleSearch}
                                backgroupColor={'#F1F1F1'}
                            />
                        </Box>

                    </Box>
                </Box>
                <Divider sx={{ background: "grey", mb: 1 }} />

                {status === "Public" || status === "Private" ? (
                    <Typography sx={{ color: "black" }}>
                        {status == "Private" ? `This content will present only on your feed` : `This content will present on public feed`}
                    </Typography>
                ) : status === "Friend" ? (
                    <Box
                        sx={{ minHeight: 100, height: 300, maxHeight: 500, width: "100%" }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            rowSelectionModel={selectedRows}
                            onRowSelectionModelChange={handleSelectionModelChange}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                        uid: false,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{ minHeight: 100, height: 300, maxHeight: 500, width: "100%" }}
                    >
                        <DataGrid
                            rows={rows ?? []}
                            columns={columns}
                            rowSelectionModel={selectedRows}
                            onRowSelectionModelChange={handleSelectionModelChange}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                        uid: false,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </Box>
                )}

                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}
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
                        onClick={props.handleCloseShare}
                    >
                        Cancle
                    </Button>
                    <Button
                        onClick={
                            props.postId ? () => handleShare() : () => handleShareEvent()
                        }
                        sx={{
                            backgroundColor: "#8E51E2",
                            color: "white",
                            "&:hover": {
                                color: "black",
                                backgroundColor: "#E1E1E1",
                            },
                        }}
                    >
                        Share
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
