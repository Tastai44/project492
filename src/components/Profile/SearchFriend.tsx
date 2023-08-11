import { Grid, Typography } from "@mui/material";
import { User } from "../../interface/User";
import FriendCard from "./FriendCard";

interface IData {
  searchValue: string;
  inFoUser: User[];
}
export default function SearchFriend(props: IData) {
  return (
    <div>
      {
        props.inFoUser
          .filter(item => item.firstName.includes(props.searchValue) || item.lastName.includes(props.searchValue))
          .map(user => (
            <Grid sx={{ flexGrow: 1, gap: 1 }} container key={user.uid}>
              {user.friendList?.length !== 0 ? (
                user.friendList?.map(friend => (
                  <FriendCard
                    key={friend.friendId}
                    username={friend.username}
                    profilePhoto={friend.profilePhoto}
                    uid={friend.friendId}
                    friendList={user.friendList || []}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    color: "primary.contrastText",
                    ml: 1,
                  }}
                >
                  You have no friends...
                </Typography>
              )}
            </Grid>
          ))
      }

    </div>
  );
}
