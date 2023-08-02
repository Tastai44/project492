import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Divider, Paper, Typography } from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Navigation";
import SearchIcon from "@mui/icons-material/Search";
import FriendCard from "../../components/Profile/FriendCard";
import "firebase/database";
import { collection, query, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { User } from "../../interface/User";

export default function Friends() {
  const { userId } = useParams();
  const [refresh, setRefresh] = React.useState(0);

  const handleRefresh = () => {
    setRefresh((pre) => pre + 1);
  };

  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userId)
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
  }, [refresh, userId]);

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
        {inFoUser.map((user) => (
          <Grid sx={{ flexGrow: 1, gap: 1 }} container key={user.uid}>
            {user.friendList?.length !== 0 ? (
              <>
                {user.friendList?.map((friend) => (
                  <FriendCard
                    key={friend.friendId}
                    username={friend.username}
                    profilePhoto={friend.profilePhoto}
                    uid={friend.friendId}
                    friendList={user.friendList ? user.friendList : []}
                    handleRefresh={handleRefresh}
                  />
                ))}
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    color: "primary.contrastText",
                    ml: 1,
                  }}
                >
                  You have no friend...
                </Typography>
              </>
            )}
          </Grid>
        ))}
      </Paper>
    </Box>
  );
}
