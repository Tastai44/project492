import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import { Divider, Paper } from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Navigation";
import SearchIcon from "@mui/icons-material/Search";
import FriendCard from "../../components/Profile/FriendCard";

export default function Friends() {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ m: 1, fontSize: "20px" }} component="p">
            Friends
          </Box>
          <Search
            sx={{
              backgroundColor: "#F1F1F1",
              m: 1,
              "&:hover": { backgroundColor: "#C5C5C5" },
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Box>
        <Divider light sx={{ background: "grey", mb: 1 }} />
        <Grid sx={{ flexGrow: 1, gap: 1 }} container>
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
        </Grid>
      </Paper>
    </Box>
  );
}
