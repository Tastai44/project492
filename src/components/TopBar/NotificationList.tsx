import { Menu, MenuItem, Divider, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import React from "react";

interface IData {
    mobileMoreAnchorEl: null | HTMLElement;
    mobileMenuId: string;
    isMobileMenuOpen: boolean;
    handleMobileMenuClose: () => void;
}

export default function NotificationList(props: IData) {
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
                    borderRadius: "10px",
                }}
            >
                Notifications
            </MenuItem>
            <Divider style={{ background: "white" }} />
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="CMU" src="" />
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
                            Username
                        </Typography>
                    }
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="white"
                            >
                                I'll be in your neighborhood doing errands this…
                            </Typography>
                            <br />
                            {" Saturday, May 13, 2566 BE "}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider
                variant="inset"
                component="li"
                sx={{ backgroundColor: "white" }}
            />
        </Menu>
    );
}
