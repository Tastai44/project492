import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import Luffy from "../../public/pictures/Luffy.webp";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { NavLink } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function LeftSide() {
  return (
    <Box sx={{ width: "120%" }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 12">
        <NavLink to={`/profileBlog/${1}`}>
          <Item
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "bold",
            }}
          >
            <Avatar alt="Remy Sharp" src={Luffy} />
            Tastai Khianjai
          </Item>
          </NavLink>
        </Box>

        <Box gridColumn="span 12">
          <Item>
            <nav aria-label="main mailbox folders">
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
                    to={`/friends/${1}`}
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
              </List>

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
            </nav>
          </Item>
        </Box>
      </Box>
    </Box>
  );
}
