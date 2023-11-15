import { useState } from 'react';
import { Divider, Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Avatar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FlagIcon from "@mui/icons-material/Flag";
import { Logout } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import { NavLink } from 'react-router-dom';
import { User } from '../../interface/User';

interface IData {
    openMenu: boolean;
    inFoUser: User[];
    userId: string;
    IsAdmin: boolean;
    handleOpenMenu: () => void;
    handleLogout: () => void;
}

export default function SmallMenu(props: IData) {
    const drawerWidth = "100%";
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            variant="temporary"
            anchor="left"
            open={props.openMenu}
        >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={props.handleOpenMenu}>
                    <CancelIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding onClick={props.handleOpenMenu}>
                    <NavLink
                        to="/home"
                        style={({ isActive, isPending }) => {
                            return {
                                fontWeight: isPending ? "bold" : "",
                                color: isActive ? "black" : "grey",
                                backgroundColor: isActive ? "#F1F1F1" : "",
                                width: isActive ? "100%" : "100%",
                            };
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </NavLink>
                </ListItem>

                <ListItem disablePadding onClick={props.handleOpenMenu}>
                    <NavLink
                        to={`/friends/${userInfo.uid}`}
                        style={({ isActive, isPending }) => {
                            return {
                                fontWeight: isPending ? "bold" : "",
                                color: isActive ? "black" : "grey",
                                backgroundColor: isActive ? "#F1F1F1" : "",
                                width: isActive ? "100%" : "100%",
                            };
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Friends" />
                        </ListItemButton>
                    </NavLink>
                </ListItem>

                <ListItem disablePadding onClick={props.handleOpenMenu}>
                    <NavLink
                        to="/members"
                        style={({ isActive, isPending }) => {
                            return {
                                fontWeight: isPending ? "bold" : "",
                                color: isActive ? "black" : "grey",
                                backgroundColor: isActive ? "#F1F1F1" : "",
                                width: isActive ? "100%" : "100%",
                            };
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <GroupsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Members" />
                        </ListItemButton>
                    </NavLink>
                </ListItem>

                <ListItem disablePadding onClick={props.handleOpenMenu}>
                    <NavLink
                        to="/events"
                        style={({ isActive, isPending }) => {
                            return {
                                fontWeight: isPending ? "bold" : "",
                                color: isActive ? "black" : "grey",
                                backgroundColor: isActive ? "#F1F1F1" : "",
                                width: isActive ? "100%" : "100%",
                            };
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <DateRangeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Events" />
                        </ListItemButton>
                    </NavLink>
                </ListItem>

                <ListItem disablePadding onClick={props.handleOpenMenu}>
                    <NavLink
                        to="/topics"
                        style={({ isActive, isPending }) => {
                            return {
                                fontWeight: isPending ? "bold" : "",
                                color: isActive ? "black" : "grey",
                                backgroundColor: isActive ? "#F1F1F1" : "",
                                width: isActive ? "100%" : "100%",
                            };
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <TagIcon />
                            </ListItemIcon>
                            <ListItemText primary="Topics" />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem disablePadding onClick={props.handleOpenMenu}>
                    <NavLink
                        to="/groups"
                        style={({ isActive, isPending }) => {
                            return {
                                fontWeight: isPending ? "bold" : "",
                                color: isActive ? "black" : "grey",
                                backgroundColor: isActive ? "#F1F1F1" : "",
                                width: isActive ? "100%" : "100%",
                            };
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <Diversity3Icon />
                            </ListItemIcon>
                            <ListItemText primary="Groups" />
                        </ListItemButton>
                    </NavLink>
                </ListItem>

                {props.IsAdmin && (
                    <ListItem disablePadding onClick={props.handleOpenMenu}>
                        <NavLink
                            to="/Report"
                            style={({ isActive, isPending }) => {
                                return {
                                    fontWeight: isPending ? "bold" : "",
                                    color: isActive ? "black" : "grey",
                                    backgroundColor: isActive ? "#F1F1F1" : "",
                                    width: isActive ? "100%" : "100%",
                                };
                            }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <FlagIcon />
                                </ListItemIcon>
                                <ListItemText primary="Report" />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                )}


                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {props.inFoUser.map((user) => (
                            <NavLink key={user.uid} to={`/profileBlog/${user.uid}`} style={{ color: "black" }}>
                                <ListItemButton sx={{ pl: 4 }} onClick={props.handleOpenMenu}>
                                    <ListItemIcon>
                                        <Avatar src={user.profilePhoto} />
                                    </ListItemIcon>
                                    <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                                </ListItemButton>
                            </NavLink>
                        ))}
                        <ListItemButton onClick={props.handleLogout} sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </List>
                </Collapse>

            </List>
        </Drawer>
    );
}
