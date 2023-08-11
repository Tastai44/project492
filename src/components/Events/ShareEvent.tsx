import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Avatar, CardContent, Typography, CardMedia } from "@mui/material";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";

export const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

interface Idata {
	eventId: string;
	startDate: string;
	startTime: string;
	title: string;
	endDate: string;
	endTime: string;
	userId: string;
	coverPhoto: string[];
}


export default function ShareEvent(props: Idata) {
	const [inFoUser, setInFoUser] = React.useState<User[]>([]);
	React.useEffect(() => {
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
	console.log(props.userId);
	return (
		<Box>
			<Box sx={{ width: "100%" }}>
				<Stack spacing={2}>
					<Item sx={{ display: "flex", flexDirection: "column" }}>
						<NavLink to={`/eventsDetail/${props.eventId}`}>
							{props.coverPhoto.map((cover, index) => (
								<CardMedia
									key={index}
									sx={{ height: 300 }}
									image={cover}
									title="green iguana"
								/>
							))}
						</NavLink>
						<CardContent sx={{ textAlign: "justify" }}>
							<Typography
								gutterBottom
								sx={{ fontSize: "20px" }}
								component="div"
							>
								{props.title}
							</Typography>
							<Typography color={"error"}>
								<b>Start:</b> {props.startDate}, {props.startTime} <br />
								<b>End:</b> {props.endDate}, {props.endTime}
							</Typography>
							{inFoUser.map((user) => (
								<Box
									key={user.uid}
									sx={{ display: "flex", alignItems: "end", gap: 1 }}
								>
									<Avatar
										src={user.profilePhoto}
										sx={{ width: "30px", height: "30px", marginTop: 2 }}
										aria-label="recipe"
									/>
									<Typography>
										{user.firstName} {user.lastName} is owner.
									</Typography>
								</Box>
							))}
						</CardContent>
					</Item>
				</Stack>
			</Box>
		</Box>
	);
}
