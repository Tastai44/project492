import { useState, useEffect } from "react";
import { Divider, Stack, Typography, Box } from "@mui/material";
import { User } from "../../interface/User";
import { Item } from "../../App";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { useParams } from "react-router-dom";
import TabLink from "./TabLink";

export default function AboutMe() {
	const { userId } = useParams();
	const [inFoUser, setInFoUser] = useState<User[]>([]);

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

	return (
		<div>
			<TabLink
				userId={userId ?? ""}
			/>
			<Box>
				<Stack
					direction="row"
					divider={<Divider orientation="vertical" flexItem />}
					sx={{
						backgroundColor: "white",
						display: "flex",
						justifyContent: "center",
						borderRadius: "10px"
					}}
				>
					<Item
						sx={{
							fontSize: "30px",
							width: "50%",
							alignSelf: "center",
							textAlign: "center"
						}}
					>
						About me
					</Item>
					{inFoUser.map((m) => (
						<Item
							key={m.uid}
							sx={{
								padding: "50px",
								width: "50%",
								textAlign: "left",
								display: "flex",
								flexDirection: "column",
								gap: "10px",
							}}
						>
							<Typography>
								<b>Faculty:</b> {m.faculty}
							</Typography>
							<Typography>
								<b>Year:</b> {m.year}
							</Typography>
							<Typography>
								<b>Status:</b> {m.status}
							</Typography>
							<Typography>
								<b>IG:</b> {m.instagram}
							</Typography>
						</Item>
					))}
				</Stack>
			</Box>
		</div>
	);
}
