import {
    Menu,
    Divider,
    Box,
} from "@mui/material";
import { IGroupMessageNoti, IMessageNoti } from "../../interface/Notification";
import NotiCard from "./NotiCard";
import GroupNotiCard from "./GroupNotiCard";
import TitleMessage from "./TitleMessage";

interface IData {
    openMessageNoti: null | HTMLElement;
    messageNotiList: string;
    isMessageMenuOpen: boolean;
    messageNoti: IMessageNoti[];
    groupMessageNoti: IGroupMessageNoti[];
    imageUrls: string[];
    owner: string;
    handleCloseMessageNoti: () => void;
}

export default function MessageNoti(props: IData) {
    const combinedNotifications = [...props.messageNoti, ...props.groupMessageNoti];
    combinedNotifications.sort((a, b) => {
        const dateA = new Date(a.dateCreated).getTime();
        const dateB = new Date(b.dateCreated).getTime();
        return dateB - dateA;
    });

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
                        overflow: "auto",
                        height: "500px",
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
                <TitleMessage />
                <Divider style={{ background: "white" }} />
                {combinedNotifications.filter((item) => item.senderId !== props.owner).map((noti) => {
                    if ("groupId" in noti) {
                        return (
                            <GroupNotiCard
                                key={noti.notiId}
                                message={noti.message}
                                dateCreated={noti.dateCreated}
                                senderId={noti.senderId}
                                notiId={noti.notiId}
                                groupId={noti.groupId}
                                isRead={noti.isRead}
                                imageUrls={props.imageUrls}
                            />
                        );
                    } else {
                        return (
                            <NotiCard
                                key={noti.notiId}
                                message={noti.message}
                                dateCreated={noti.dateCreated}
                                senderId={noti.senderId}
                                notiId={noti.notiId}
                                isRead={noti.isRead}
                                imageUrls={props.imageUrls}
                            />
                        );
                    }
                })}
            </Menu>
        </Box>
    );
}
