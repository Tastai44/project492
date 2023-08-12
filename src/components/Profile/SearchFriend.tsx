import { Grid, Typography } from "@mui/material";
import { IFriendList } from "../../interface/User";
import FriendCard from "./FriendCard";

interface IData {
  searchValue: string;
  userId: string;
  friendList?: IFriendList[];
}
export default function SearchFriend(props: IData) {
  return (
    <div>
      <Grid sx={{ flexGrow: 1, gap: 1 }} container>
        {props.friendList
          ? props.friendList
            .filter((friend) => friend.username.includes(props.searchValue))
            .map((user) => (
              <FriendCard
                key={user.friendId}
                username={user.username}
                profilePhoto={user.profilePhoto}
                uid={user.friendId}
                friendList={props.friendList || []}
              />
            ))
          : (
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
    </div>
  );

}
