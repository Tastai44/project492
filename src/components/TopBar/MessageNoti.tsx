import { useMemo, useState, Fragment } from "react";
import {
    Menu,
    MenuItem,
    Divider,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Box,
    Modal,
} from "@mui/material";
import { IGroupMessageNoti, IMessageNoti } from "../../interface/Notification";
import { collection, where, onSnapshot, query } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IGroup } from "../../interface/Group";
import GroupChatBox from "../GroupChat/GroupChatBox";
import NotiCard from "./NotiCard";

interface IData {
    openMessageNoti: null | HTMLElement;
    messageNotiList: string;
    isMessageMenuOpen: boolean;
    messageNoti: IMessageNoti[];
    groupMessageNoti: IGroupMessageNoti[];
    handleCloseMessageNoti: () => void;
}

export default function MessageNoti(props: IData) {
    const [inFoGroup, setInFoGroup] = useState<IGroup[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [openChat, setOpenChat] = useState(false);
    const groupId =
        props.groupMessageNoti.find((noti) => noti.groupId)?.groupId ?? "";

    useMemo(() => {
        const queryData = query(
            collection(dbFireStore, "groups"),
            where("gId", "==", groupId)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as IGroup);
                setInFoGroup(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [groupId]);

    const handleOpenChat = () => setOpenChat(true);
    const handleCloseChat = () => setOpenChat(false);

    const [openGroupChat, setOpenGroupChat] = useState(false);
    const handleOpenGroupChat = () => setOpenGroupChat(true);
    const handleCloseGroupChat = () => setOpenGroupChat(false);

    const groupNotification: IGroupMessageNoti | undefined = props.groupMessageNoti
        .filter(
            (item) =>
                item.groupId === groupId &&
                inFoGroup.some((group) =>
                (group.members.some((member) => member.memberId == userInfo.uid) ||
                    group.hostId == userInfo.uid
                )
                )
        ).at(0);

    return (
        <Box>

            <Modal
                open={openGroupChat}
                onClose={handleCloseGroupChat}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <GroupChatBox
                        groupId={groupId}
                        handleClose={handleCloseGroupChat}
                    />
                </Box>
            </Modal>

            <Menu
                anchorEl={props.openMessageNoti}
                id={props.messageNotiList}
                open={props.isMessageMenuOpen}
                onClose={props.handleCloseMessageNoti}
                // onClick={props.handleCloseMessageNoti}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        background: "#f3ebff",
                        color: "white",
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem
                    sx={{
                        fontSize: "20px",
                        padding: "5px",
                        fontWeight: "bold",
                        color: "black",
                        margin: 2,
                        width: "300px",
                        borderRadius: "10px",
                        "&:hover": {
                            color: "black",
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    Messages
                </MenuItem>
                <Divider style={{ background: "white" }} />
                {props.messageNoti.length !== 0 ? (
                    props.messageNoti.map((message) => (
                        <NotiCard
                            key={message.notiId}
                            message={message.message}
                            dateCreated={message.dateCreated}
                            senderId={message.senderId}
                            notiId={message.notiId}
                            openChat={openChat}
                            handleOpenChat={handleOpenChat}
                            handleCloseChat={handleCloseChat}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}


                {groupNotification && (
                    <ListItem
                        onClick={handleOpenGroupChat}
                        alignItems="flex-start"
                        sx={{
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "primary.contrastText",
                            },
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar
                                alt="CMU"
                                src={inFoGroup.find((group) => group.coverPhoto)?.coverPhoto}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        display: "inline",
                                    }}
                                    fontSize={16}
                                    component="span"
                                    variant="body2"
                                    color="black"
                                    fontWeight="bold"
                                >
                                    {inFoGroup.find((group) => group.groupName)?.groupName}
                                </Typography>
                            }
                            secondary={
                                <Fragment>
                                    <Typography
                                        sx={{ display: "inline", fontSize: "16px" }}
                                        component="span"
                                        variant="body2"
                                        color="black"
                                    >
                                        <b> Message</b>: {groupNotification?.message}
                                    </Typography>
                                    <br />
                                    {groupNotification?.dateCreated}
                                </Fragment>
                            }
                        />
                    </ListItem>
                )}
            </Menu>
        </Box>
    );
}
