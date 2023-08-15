import { useMemo, useState, Fragment } from "react";
import { Menu, MenuItem, Divider, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import { IMessageNoti } from "../../interface/Notification";
import { collection, where, onSnapshot, query } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";

interface IData {
    openMessageNoti: null | HTMLElement;
    messageNotiList: string;
    isMessageMenuOpen: boolean;
    messageNoti: IMessageNoti[];
    handleCloseMessageNoti: () => void;
}

export default function MessageNoti(props: IData) {
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const senderId = props.messageNoti.find((noti) => noti.senderId)?.senderId ?? "";
    useMemo(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", senderId)
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
    }, [senderId]);

    return (
        <Menu
            anchorEl={props.openMessageNoti}
            id={props.messageNotiList}
            open={props.isMessageMenuOpen}
            onClose={props.handleCloseMessageNoti}
            onClick={props.handleCloseMessageNoti}
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
            {props.messageNoti.filter((item) => item.receiverId === userInfo.uid).map((noti) => (
                <ListItem key={noti.notiId} alignItems="flex-start" sx={{
                    cursor: "pointer", "&:hover": {
                        backgroundColor: "primary.contrastText"
                    }
                }}>
                    <ListItemAvatar>
                        <Avatar alt="CMU" src={inFoUser.find((user) => user.profilePhoto)?.profilePhoto} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{
                                    display: "inline"
                                }}
                                fontSize={16}
                                component="span"
                                variant="body2"
                                color="black"
                                fontWeight="bold"
                            >
                                {`${inFoUser.find((user) => user.firstName)?.firstName} ${inFoUser.find((user) => user.lastName)?.lastName}`}
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
                                    <b> Message</b>: {noti.message}
                                </Typography>
                                <br />
                                {noti.createAt}
                            </Fragment>
                        }
                    />
                </ListItem>
            ))}


        </Menu>
    );
}
