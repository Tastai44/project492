import { Divider, Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Drawer from '@mui/material/Drawer';
import { NavLink } from 'react-router-dom';

interface IData {
    openMenu: boolean;
    handleOpenMenu: () => void;
}

export default function SmallMenu(props: IData) {
    const drawerWidth = "100%";
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");

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
                <ListItem disablePadding>
                    <NavLink
                        to="/"
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

                <ListItem disablePadding>
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

                <ListItem disablePadding>
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

                <ListItem disablePadding>
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

                <ListItem disablePadding>
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
                <ListItem disablePadding>
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
            </List>
        </Drawer>
    );
}
