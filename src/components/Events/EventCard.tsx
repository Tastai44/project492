import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Avatar, Box } from "@mui/material";

import { NavLink } from "react-router-dom";
import { User } from "../../interface/User";
import { dbFireStore, storage } from "../../config/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";

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
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);

	useEffect(() => {
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

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const listRef: StorageReference = ref(storage, '/Images');
				const res = await listAll(listRef);
				const urls = await Promise.all(
					res.items.map(async (itemRef) => {
						const imageUrl = await getDownloadURL(itemRef);
						return imageUrl;
					})
				);
				setImageUrls(urls);
			} catch (error) {
				console.error('Error fetching images:', error);
			}
		};
		fetchImages();
	}, []);

	return (
		<Card sx={{ width: 258, height: 360, borderRadius: "20px" }}>
			<NavLink to={`/eventsDetail/${props.eventId}`}>
				{imageUrls.length !== 0 && (
					<CardMedia
						sx={{ height: 194 }}
						image={imageUrls.find((item) => item.includes(props.coverPhoto ?? ""))}
						title="green iguana"
					/>
				)}
				<CardContent sx={{ textAlign: "justify" }}>
					<Typography gutterBottom sx={{ fontSize: "20px" }} component="div">
						{props.title}
					</Typography>
					<Typography>
						<b>Start:</b> {props.startDate}, {props.startTime} <br />
						<b>End:</b> {props.endDate}, {props.endTime}
					</Typography>
					{inFoUser.map((user) => (
						<Box
							key={user.uid}
							sx={{ display: "flex", alignItems: "end", gap: 1 }}
						>
							<Avatar
								src={imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))}
								sx={{ width: "30px", height: "30px", marginTop: 2 }}
								aria-label="recipe"
							/>
							<Typography>
								{user.firstName} is owner.
							</Typography>
						</Box>
					))}
				</CardContent>
			</NavLink>
		</Card>
	);
}
