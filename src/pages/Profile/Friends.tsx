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
import * as React from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore"
import { dbFireStore } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { User } from "../../interface/User";

export default function Friends() {
  const { userId } = useParams();
  const [user, setUser] = React.useState<User[]>([]);
  React.useMemo(() => {
    const fetchData = async () => {
      try{
        const queryData = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userId),
          orderBy("firstName", "desc")
        );
        const querySnapshot = await getDocs(queryData);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as User);
          setUser(queriedData);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    }
    fetchData();
  }, [userId])

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
          {user.map((user) => (
            <Box key={user.uid}>
              {user.friendList?.map((friend) => (
                <FriendCard 
                  key={friend.friendId}
                  username={friend.username}
                  profilePhoto={friend.profilePhoto}
                  uid={friend.friendId}
                />
              ))}
            </Box>
            
          ))}
          
        </Grid>
      </Paper>
    </Box>
  );
}
