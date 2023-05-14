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
  Stack,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import Luffy from "../../../public/pictures/Luffy.webp";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { color } from "@mui/system";

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
  return (
    <div>
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
                    {" "}
                    <AddAPhotoIcon />{" "}
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

          <Item sx={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "20px" }}>Tastai Khianjai</div>
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
            >
              Edit
            </Button>
          </Item>
          <Divider style={{ background: "#EAEAEA" }} />

          <Item>
            <nav aria-label="secondary mailbox folders">
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Blog" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#simple-list">
                    <ListItemText primary="About Me" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Friends" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#simple-list">
                    <ListItemText primary="Collections" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Item>
        </Stack>
      </Box>
    </div>
  );
}
