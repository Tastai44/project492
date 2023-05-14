import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Button, Divider, InputBase, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import UserCard from "./UserCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  backgroundColor: "grey",
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

export default function RightContainer() {
  return (
    <Box sx={{ width: "30vh" }}>
      <Stack spacing={2}>
        <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              fontSize: "18px",
              fontWeight: "bold",
              padding:10
            }}
          >
            Friend
          </div>
          <div>
            <TextField
              id="outlined-size-small"
              size="small"
              sx={{ m: 1, width: "25vh" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              placeholder="Search for friend"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button sx={{ color: "black" }}>Active</Button>
            <Button sx={{ color: "black" }}>General</Button>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <UserCard />
          <UserCard />
        </Item>

        <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              fontSize: "18px",
              fontWeight: "bold",
              padding:10
            }}
          >
            Groups
          </div>
          <div>
            <TextField
              id="outlined-size-small"
              size="small"
              sx={{ m: 1, width: "25vh" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              placeholder="Search for friend"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button sx={{ color: "black" }}>Active</Button>
            <Button sx={{ color: "black" }}>General</Button>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <UserCard />
          <UserCard />
        </Item>
      </Stack>
    </Box>
  );
}
