import {
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Box,
	Typography,
	Paper,
} from "@mui/material";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	getDocs,
	where,
} from "firebase/firestore";
import React from "react";
import { User } from "../../interface/User";

interface IData {
	text: string;
	createAt: string;
	userId: string;
}

export default function ReasonContent(props: IData) {

	const [inFoUser, setInFoUser] = React.useState<User[]>([]);
	React.useMemo(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", props.userId)
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
	}, [props.userId]);

	return (
		<Box>
			<Paper sx={{ backgroundColor: "primary.contrastText", mb: 1 }}>
				{inFoUser.map((user) => (
					<ListItem key={user.uid}>
						<ListItemAvatar>
							<Avatar src={user.profilePhoto} sx={{ width: "40px", height: "40px" }} />
						</ListItemAvatar>
						<ListItemText
							primary={
								<Box sx={{ fontSize: "16px" }}>
									<b>{user.firstName} {user.lastName}</b>
								</Box>
							}
							secondary={
								<Typography
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										fontSize: "16px",
									}}
								>
									{props.createAt}
								</Typography>
							}
						/>
					</ListItem>
				))}

				<Box sx={{ ml: 1, pb: 1, fontSize: "16px" }}>{props.text}</Box>
			</Paper>
		</Box>
	);
}
