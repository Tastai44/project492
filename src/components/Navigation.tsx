import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from '@mui/material/AppBar';
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
} from "@mui/material";
import {Logout } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const Search = styled("div")(({ theme }) => ({
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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          padding: "20px",
          gap: "10px",
          margin: 1,
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <Avatar src={Luffy} /> Tastai Khianjai
      </MenuItem>
      <Divider style={{ background: "white" }} />
      <MenuItem
        onClick={handleMenuClose}
        sx={{ padding: "20px", color: "white" }}
      >
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
      {/* <MenuItem sx={{width:"100px"}}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Avatar alt="CMU" src={Luffy} />
        </IconButton>
        <p>Notifications...Notifications...Notifications...Notifications...Notifications...</p>
      </MenuItem> */}
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
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="fixed" sx={{ backgroundColor: "#8E51E2"}}>
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <Avatar alt="CMU" src={Logo} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
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
            <HomeIcon
              sx={{
                fontSize: "30px",
                "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                borderRadius: "10px",
                padding: "10px",
              }}
            />
            <PeopleAltIcon
              sx={{
                fontSize: "30px",
                "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                borderRadius: "10px",
                padding: "10px",
              }}
            />
            <GroupsIcon
              sx={{
                fontSize: "30px",
                "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                borderRadius: "10px",
                padding: "10px",
              }}
            />
            <DateRangeIcon
              sx={{
                fontSize: "30px",
                "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                borderRadius: "10px",
                padding: "10px",
              }}
            />
            <TagIcon
              sx={{
                fontSize: "30px",
                "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                borderRadius: "10px",
                padding: "10px",
              }}
            />
            <Diversity3Icon
              sx={{
                fontSize: "30px",
                "&:hover": { backgroundColor: "#e8e8e8", color: "#8E51E2" },
                borderRadius: "10px",
                padding: "10px",
              }}
            />
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
            <IconButton
              size="small"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {/* <AccountCircle src={Logo}/> */}
              <Avatar alt="CMU" src={Luffy} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
