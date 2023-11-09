import { useState } from "react";
import {
    Paper,
    Divider,
    Box,
    Typography,
    Modal,
    MenuItem,
    IconButton,
    Menu,
} from "@mui/material";
import UserCard from "../RightSide/UserCard";
import { NavLink } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddMembers from "./AddMembers";
import DeleteMember from "./DeleteMember";

interface IData {
    members: string[];
    hostId: string;
    gId: string;
}

export default function Members(props: IData) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(
        null
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleOpenAdd = () => {
        setOpenAdd(true);
        handleCloseUserMenu();
    };
    const handleCloseAdd = () => setOpenAdd(false);
    const handleOpenDelete = () => {
        setOpenDelete(true);
        handleCloseUserMenu();
    };
    const handleCloseDelete = () => setOpenDelete(false);

    return (
        <div>
            <Modal
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <AddMembers
                        hostId={props.hostId}
                        gId={props.gId}
                        members={props.members}
                        handleClose={handleCloseAdd}
                    />
                </Box>
            </Modal>

            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <DeleteMember
                        gId={props.gId}
                        members={props.members}
                        handleCloseDelete={handleCloseDelete}
                    />
                </Box>
            </Modal>

            <Paper sx={{ borderRadius: "10px" }}>
                <Box
                    sx={{
                        p: 1,
                        ml: 1,
                        mr: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                        Members
                    </Typography>
                    <IconButton onClick={handleOpenUserMenu}>
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        sx={{ mt: "30px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem
                            disabled={props.hostId !== userInfo.uid}
                            onClick={handleOpenAdd}>
                            <Typography
                                textAlign="center"
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "start",
                                    fontSize: "18px",
                                }}
                            >
                                <AddCircleOutlineOutlinedIcon /> Add
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            disabled={props.hostId !== userInfo.uid}
                            onClick={handleOpenDelete}
                        >
                            <Typography
                                textAlign="center"
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "start",
                                    fontSize: "18px",
                                }}
                            >
                                <DeleteOutlineOutlinedIcon /> Delete
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Box>
                <Divider light />
                {props.members.map((member, index) => (
                    <Box key={member + index}>
                        <NavLink to={`/profileBlog/${member}`} style={{ color: "black" }}>
                            <UserCard userId={member} />
                        </NavLink>
                    </Box>
                ))}
            </Paper>
        </div>
    );
}
