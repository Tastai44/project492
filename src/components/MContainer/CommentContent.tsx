import * as React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

export default function CommentContent() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Paper sx={{backgroundColor:"primary.contrastText" , mb:3}}>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={Luffy} sx={{ width: "40px", height: "40px" }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ fontSize: "16px" }}>
              <b>User Name</b>
            </Box>
          }
          secondary={
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "12px",
              }}
            >
              6/13/2023, 10:36:09 PM
            </Typography>
          }
        />
        <ListItemAvatar>
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
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography
                textAlign="center"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "start",
                  fontSize: "18px",
                }}
              >
                <BorderColorOutlinedIcon /> Edit
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
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
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography
                textAlign="center"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "start",
                  fontSize: "18px",
                }}
              >
                <FlagOutlinedIcon /> Report
              </Typography>
            </MenuItem>
          </Menu>
        </ListItemAvatar>
      </ListItem>
      <Box sx={{ m:1 }}>
        The sun began its descent in the sky, casting a warm, golden glow over
        the rolling hills. The grass, kissed by the afternoon light, swayed
        gently in the breeze, creating a mesmerizing dance of green. The air was
        filled with the sweet fragrance of blooming wildflowers that dotted the
        landscape, their vibrant colors adding splashes of beauty to the scene.
        In the distance, a tranquil river meandered through the valley, its
        crystal-clear waters reflecting the brilliance of the setting sun.
        Towering trees stood like sentinels along the riverbanks, their branches
        reaching towards the heavens as if in silent prayer. The entire panorama
        was painted with nature's brush, a masterpiece of serenity and harmony.
        As the day drew to a close, the sky transformed into a canvas of fiery
        oranges and pinks, merging with the cool hues of purples and blues. The
        scene exuded a sense of tranquility, inviting one to pause, breathe in
        the scents, and immerse themselves in the breathtaking beauty of the
        natural world.
      </Box>
    </Paper>
  );
}
