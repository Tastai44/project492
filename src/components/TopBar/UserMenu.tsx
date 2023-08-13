import { Logout } from '@mui/icons-material';
import { Menu, MenuItem, Avatar, Typography, Divider, ListItemIcon } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { User } from '../../interface/User';

interface IData {
    anchorEl: null | HTMLElement;
    menuId: string;
    isMenuOpen: boolean;
    inFoUser: User[];
    userId: string;
    handleMenuClose: () => void;
    handleLogout: () => void;
}

export default function UserMenu(props: IData) {
    return (
        <Menu
            anchorEl={props.anchorEl}
            id={props.menuId}
            open={props.isMenuOpen}
            onClose={props.handleMenuClose}
            onClick={props.handleMenuClose}
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
            <NavLink to={`/profileBlog/${props.userId}`}>
                {props.inFoUser.map((m) => (
                    <MenuItem
                        key={m.uid}
                        onClick={props.handleMenuClose}
                        sx={{
                            color: "black",
                            padding: "10px",
                            gap: "10px",
                            margin: 1,
                            backgroundColor: "white",
                            borderRadius: "10px",
                            "&:hover": {
                                color: "white",
                                backgroundColor: "grey",
                            },
                        }}
                    >
                        <Avatar src={m.profilePhoto} />
                        <Typography>{`${m.firstName} ${m.lastName}`}</Typography>
                    </MenuItem>
                ))}
            </NavLink>
            <Divider style={{ background: "white" }} />
            <MenuItem onClick={props.handleLogout} sx={{ padding: "20px", color: "white" }}>
                <ListItemIcon>
                    <Logout fontSize="small" style={{ color: "white" }} />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    );
}
