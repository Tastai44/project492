import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Avatar, Box } from "@mui/material";

import { NavLink } from "react-router-dom";
import { User } from "../../interface/User";
import { dbFireStore } from "../../config/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

interface IData {
	eventId: string;
	startDate: string;
	startTime: string;
	title: string;
	endDate: string;
	endTime: string;
	ownerId: string;
	coverPhoto: string;
}

export default function MediaCard(props: IData) {
	const [inFoUser, setInFoUser] = React.useState<User[]>([]);
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", props.ownerId)
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
	}, [props.ownerId]);
	console.log(props.ownerId);

	return (
		<Card sx={{ width: 258, height: 360 }}>
			<NavLink to={`/eventsDetail/${props.eventId}`}>
				<CardMedia
					sx={{ height: 194 }}
					image={props.coverPhoto}
					title="green iguana"
				/>
			</NavLink>
			<CardContent sx={{ textAlign: "justify" }}>
				<Typography gutterBottom sx={{ fontSize: "20px" }} component="div">
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
		</Card>
	);
}
