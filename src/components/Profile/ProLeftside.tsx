import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Luffy from "../../../public/pictures/Luffy.webp";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { NavLink } from "react-router-dom";
import * as React from "react";
import EditProfile from "./EditProfile";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: "white",
  color: "black",
}));

export default function ProLeftside() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditProfile />
        </Box>
      </Modal>
      <div style={{ position: "fixed" }}>
        <Box sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <SmallAvatar
                      sx={{
                        "&:hover": {
                          color: "white",
                          backgroundColor: "black",
                        },
                      }}
                    >
                      <AddAPhotoIcon />
                    </SmallAvatar>
                  }
                >
                  <Avatar
                    alt="Travis Howard"
                    src={Luffy}
                    sx={{ width: "186px", height: "186px" }}
                  />
                </Badge>
              </Stack>
            </Item>

            <Item
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                gap: "5px",
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Tastai Khianjai
              </div>
              <div>@Username</div>
              <Button
                sx={{
                  width: "30px",
                  backgroundColor: "#8E51E2",
                  color: "white",
                  "&:hover": {
                    color: "black",
                    backgroundColor: "white",
                  },
                }}
                onClick={handleOpen}
              >
                Edit
              </Button>
            </Item>
            <Divider style={{ background: "#EAEAEA" }} />

            <Item>
              <nav aria-label="secondary mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <NavLink
                      to={`/profileBlog/${1}`}
                      style={({ isActive, isPending }) => {
                        return {
                          fontWeight: isPending ? "bold" : "",
                          color: isActive ? "black" : "grey",
                          backgroundColor: isActive ? "#B8B8B8" : "",
                          width: isActive ? "100%" : "100%",
                        };
                      }}
                    >
                      <ListItemButton>
                        <ListItemText primary="Blog" />
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <NavLink
                      to={`/aboutMe/${1}`}
                      style={({ isActive, isPending }) => {
                        return {
                          fontWeight: isPending ? "bold" : "",
                          color: isActive ? "black" : "grey",
                          backgroundColor: isActive ? "#B8B8B8" : "",
                          width: isActive ? "100%" : "100%",
                        };
                      }}
                    >
                      <ListItemButton>
                        <ListItemText primary="About Me" />
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <NavLink
                      to={`/friends/${1}`}
                      style={({ isActive, isPending }) => {
                        return {
                          fontWeight: isPending ? "bold" : "",
                          color: isActive ? "black" : "grey",
                          backgroundColor: isActive ? "#B8B8B8" : "",
                          width: isActive ? "100%" : "100%",
                        };
                      }}
                    >
                      <ListItemButton>
                        <ListItemText primary="Friends" />
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <NavLink
                      to={`/collections/${1}`}
                      style={({ isActive, isPending }) => {
                        return {
                          fontWeight: isPending ? "bold" : "",
                          color: isActive ? "black" : "grey",
                          backgroundColor: isActive ? "#B8B8B8" : "",
                          width: isActive ? "100%" : "100%",
                        };
                      }}
                    >
                      <ListItemButton>
                        <ListItemText primary="Collections" />
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                </List>
              </nav>
            </Item>
          </Stack>
        </Box>
      </div>
    </>
  );
}
