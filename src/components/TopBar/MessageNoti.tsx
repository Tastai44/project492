import {
    Menu,
    MenuItem,
    Divider,
    Box,
} from "@mui/material";
import { IGroupMessageNoti, IMessageNoti } from "../../interface/Notification";
import NotiCard from "./NotiCard";
import GroupNotiCard from "./GroupNotiCard";

interface IData {
    openMessageNoti: null | HTMLElement;
    messageNotiList: string;
    isMessageMenuOpen: boolean;
    messageNoti: IMessageNoti[];
    groupMessageNoti: IGroupMessageNoti[];
    handleCloseMessageNoti: () => void;
}

export default function MessageNoti(props: IData) {

    return (
        <Box>
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
                {props.messageNoti.length !== 0 && (
                    props.messageNoti.map((message) => (
                        <NotiCard
                            key={message.notiId}
                            message={message.message}
                            dateCreated={message.dateCreated}
                            senderId={message.senderId}
                            notiId={message.notiId}
                            isRead={message.isRead}
                        />
                    ))
                )}

                {props.groupMessageNoti.length !== 0 && (
                    props.groupMessageNoti.map((message) => (
                        <GroupNotiCard
                            key={message.notiId}
                            message={message.message}
                            dateCreated={message.dateCreated}
                            senderId={message.senderId}
                            notiId={message.notiId}
                            groupId={message.groupId}
                            isRead={message.isRead}
                        />
                    ))
                )}
            </Menu>
        </Box>
    );
}
