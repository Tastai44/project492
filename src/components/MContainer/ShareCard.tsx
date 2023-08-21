import { useState, ChangeEvent } from "react";
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
import { IFriendList } from "../../interface/User";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { collection, updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import SearchBar from "../../helper/SearchBar";
import { createNoti } from "../NotificationFunction";
import { Post } from "../../interface/PostContent";

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
}

export default function ShareCard(props: IData & IFunction) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [searchValue, setValue] = useState("");
    const rows = props.friendList.map((row, index) => ({
        id: `${row.friendId}_${index}`,
        uid: row.friendId,
        username: row.username,
        profilePhoto: row.profilePhoto,
    }));

    const [status, setStatus] = useState("");
    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };
    const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
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
            const existingShareIndex = post.shareUsers.findIndex(
                (share) => (share.shareBy === userInfo.uid && share.shareTo === userInfo.uid)
            );

            if (existingShareIndex !== -1) {
                PopupAlert("Share already exists for this user and post", "warning");
                return;
            }

            if (filterRowsData.length !== 0) {
                try {
                    for (let i = 0; i < filterRowsData.length; i++) {
                        const updateShare = {
                            shareBy: userInfo.uid,
                            shareTo: status === "Friend" ? filterRowsData[i].uid : "",
                            status: status,
                            createdAt: new Date().toLocaleString(),
                        };
                        createNoti(
                            (props.postId ?? ""), ` shared ${props.postCaption}`, userInfo.uid, status, [filterRowsData[i].uid], filterRowsData[i].uid
                        );
                        const postRef = doc(postsCollection, props.postId);
                        await updateDoc(postRef, {
                            participants: arrayUnion(filterRowsData[i].uid),
                            shareUsers: arrayUnion(updateShare),
                        });
                    }
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
                const postRef = doc(postsCollection, props.postId);
                await updateDoc(postRef, {
                    shareUsers: arrayUnion(updateShare),
                });
                createNoti(
                    (props.postId ?? ""), ` shared ${props.postCaption}`, userInfo.uid, status,
                    [
                        ...props.friendList?.flatMap((friend) => friend.friendId) || []
                    ]
                );
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
            const filterRowsData = rows.filter((row) =>
                getRowsId.includes(row.id ? row.id : "")
            );

            if (filterRowsData.length !== 0) {
                try {
                    for (let i = 0; i < filterRowsData.length; i++) {
                        const updatedEvent = {
                            shareBy: userInfo.uid,
                            shareTo: status === "Friend" ? filterRowsData[i].uid : "",
                            status: status,
                            createdAt: new Date().toLocaleString(),
                        };
                        const eventRef = doc(eventCollection, props.eventId);
                        await updateDoc(eventRef, {
                            shareUsers: arrayUnion(updatedEvent),
                        });
                    }
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
                    shareUsers: arrayUnion(updatedEvent),
                });
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
                        sx={{ color: "black" }}
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
                                        }}
                                    >
                                        <LockIcon /> Private
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
                        <SearchBar
                            searchValue={searchValue}
                            handleSearch={handleSearch}
                        />
                    </Box>
                </Box>
                <Divider sx={{ background: "grey", mb: 1 }} />

                {status === "Public" || status === "Private" || status === "" ? (
                    <Box
                        sx={{ minHeight: 100, height: 300, maxHeight: 500, width: "100%" }}
                    >
                        <DataGrid
                            rows={[]}
                            columns={columns}
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
