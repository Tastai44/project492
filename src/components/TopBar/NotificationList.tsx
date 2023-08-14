import { useEffect, useState, Fragment } from "react";
import { Menu, MenuItem, Divider, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import { INoti } from "../../interface/Notification";
import { collection, where, onSnapshot, query } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";

interface IData {
    mobileMoreAnchorEl: null | HTMLElement;
    mobileMenuId: string;
    isMobileMenuOpen: boolean;
    notifications: INoti[];
    handleMobileMenuClose: () => void;
}

export default function NotificationList(props: IData) {
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const userId = props.notifications.find((noti) => noti.actionBy)?.actionBy ?? "";
    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", userId)
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
    }, [userId]);

    return (
        <Menu
            anchorEl={props.mobileMoreAnchorEl}
            id={props.mobileMenuId}
            open={props.isMobileMenuOpen}
            onClose={props.handleMobileMenuClose}
            onClick={props.handleMobileMenuClose}
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
                    background: "#B885FF",
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
                    color: "White",
                    margin: 2,
                    width: "300px",
                    borderRadius: "10px",
                }}
            >
                Notifications
            </MenuItem>
            <Divider style={{ background: "white" }} />
            {props.notifications.map((noti) => (
                <ListItem key={noti.notiId} alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="CMU" src={inFoUser.find((user) => user.profilePhoto)?.profilePhoto} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="white"
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
                                    color="white"
                                >
                                    {noti.actionMessage}
                                </Typography>
                                <br />
                                {noti.createAt}
                            </Fragment>
                        }
                    />
                </ListItem>
            ))}

            <Divider
                variant="inset"
                component="li"
                sx={{ backgroundColor: "white" }}
            />
        </Menu>
    );
}
