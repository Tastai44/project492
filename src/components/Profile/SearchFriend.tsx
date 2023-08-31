import { Grid, Typography } from "@mui/material";
import { IFriendList, User } from "../../interface/User";
import FriendCard from "./FriendCard";

interface IData {
	searchValue: string;
	userId: string;
	friendList?: IFriendList[];
	otherUser: User[];
}
export default function SearchFriend(props: IData) {
	return (
		<div>
			<Grid sx={{ flexGrow: 1, gap: 1 }} container>
				{props.friendList ? (
					props.otherUser
						.filter(
							(other) =>
								props.friendList?.some(
									(friend) => friend.friendId == other.uid
								) &&
								(other.firstName.includes(props.searchValue) ||
									other.lastName.includes(props.searchValue))
						)
						.map((other) => (
							<FriendCard
								key={other.uid}
								username={other.username}
								profilePhoto={other.profilePhoto}
								uid={other.uid}
								friendList={props.friendList || []}
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
		</div>
	);
}
