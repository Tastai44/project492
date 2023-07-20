import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Logo from "../../public/pictures/logoCmu.png";
import Luffy from "../../public/pictures/Luffy.webp";
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Modal,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import ChatBox from "./Chat/ChatBox";
import { User } from "../interface/User";
import { collection, query, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";

interface IData {
  open: boolean;
}
interface IFunction {
  handleOpen: () => void;
  handleClose: () => void;
}

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navigation({
  open,
  handleOpen,
  handleClose,
}: IData & IFunction) {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userInfo.uid)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) =>
            ({
              uid: doc.id,
              ...doc.data(),
            } as User)
        );
        setInFoUser(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo.uid]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      open={isMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
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
      <NavLink to={`/profileBlog/${userInfo.uid}`}>
      {inFoUser.map((m) => (
        <MenuItem
          key={m.uid}
          onClick={handleMenuClose}
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
          <Typography>
            {m.username}
          </Typography>
        </MenuItem>
        ))}
      </NavLink>
      <Divider style={{ background: "white" }} />
      <MenuItem onClick={handleLogout} sx={{ padding: "20px", color: "white" }}>
        <ListItemIcon>
          <Logout fontSize="small" style={{ color: "white" }} />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      onClick={handleMobileMenuClose}
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
          <Avatar alt="CMU" src={Luffy} />
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

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <ChatBox handleClose={handleClose} />
        </Box>
      </Modal>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: "#8E51E2" }}>
          <Toolbar>
            <NavLink to="/">
              <IconButton
                size="medium"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <Avatar alt="CMU" src={Logo} />
              </IconButton>
            </NavLink>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold" }}
            >
              CMU
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>

            {/* Middle */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex", gap: 30 } }}>
              <NavLink
                to="/"
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isPending ? "bold" : "",
                    color: isActive ? "white" : "white",
                    borderBlockEnd: isActive ? "2px solid white" : "",
                  };
                }}
              >
                <HomeIcon
                  sx={{
                    fontSize: "30px",
                    "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </NavLink>
              <NavLink
                to={`/friends/${userInfo.uid}`}
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isPending ? "bold" : "",
                    color: isActive ? "white" : "white",
                    borderBlockEnd: isActive ? "2px solid white" : "",
                  };
                }}
              >
                <PeopleAltIcon
                  sx={{
                    fontSize: "30px",
                    "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </NavLink>
              <NavLink
                to={"/members"}
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isPending ? "bold" : "",
                    color: isActive ? "white" : "white",
                    borderBlockEnd: isActive ? "2px solid white" : "",
                  };
                }}
              >
                <GroupsIcon
                  sx={{
                    fontSize: "30px",
                    "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </NavLink>
              <NavLink
                to={"/events"}
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isPending ? "bold" : "",
                    color: isActive ? "white" : "white",
                    borderBlockEnd: isActive ? "2px solid white" : "",
                  };
                }}
              >
                <DateRangeIcon
                  sx={{
                    fontSize: "30px",
                    "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </NavLink>
              <NavLink
                to={"/topics"}
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isPending ? "bold" : "",
                    color: isActive ? "white" : "white",
                    borderBlockEnd: isActive ? "2px solid white" : "",
                  };
                }}
              >
                <TagIcon
                  sx={{
                    fontSize: "30px",
                    "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </NavLink>
              <NavLink
                to="/groups"
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isPending ? "bold" : "",
                    color: isActive ? "white" : "white",
                    borderBlockEnd: isActive ? "2px solid white" : "",
                  };
                }}
              >
                <Diversity3Icon
                  sx={{
                    fontSize: "30px",
                    "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </NavLink>
            </Box>
            {/* Middle */}

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex", gap: 3 } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {inFoUser.map((m) => (
              <IconButton
                key={m.uid}
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar alt="Profile" src={m.profilePhoto} />
              </IconButton>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </>
  );
}
