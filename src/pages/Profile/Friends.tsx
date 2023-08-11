import { ChangeEvent, useEffect, useState } from "react";
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
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { User } from "../../interface/User";
import SearchFriend from "../../components/Profile/SearchFriend";

export default function Friends() {
	const { userId } = useParams();
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [searchValue, setValue] = useState("");

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "users"),
			where("uid", "==", userId)
		);
		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as User);
				setInFoUser(queriedData);
			},
			(error) => {
				console.error("Error fetching data: ", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [userId]);

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};
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
							onChange={handleSearch}
							value={searchValue}
						/>
					</Search>
				</Box>
				<Divider light sx={{ background: "grey", mb: 1 }} />
				{searchValue === "" ? (
					<>
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
					</>
				) : (
					<SearchFriend
						searchValue={searchValue}
						inFoUser={inFoUser}
					/>
				)}

			</Paper>
		</Box>
	);
}
