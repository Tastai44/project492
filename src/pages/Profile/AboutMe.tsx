import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Divider, Stack, Typography } from "@mui/material";
import { User } from "../../interface/User";
import { Item } from "../../App";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";

export default function AboutMe() {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [inFoUser, setInFoUser] = useState<User[]>([]);

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "users"),
			where("uid", "==", userInfo.uid)
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
	}, [userInfo.uid]);

	return (
		<div>
			<Box sx={{ width: "100%" }}>
				<Stack
					direction="row"
					divider={<Divider orientation="vertical" flexItem />}
					sx={{
						backgroundColor: "white",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Item
						sx={{
							padding: "50px",
							fontSize: "30px",
							width: "50%",
							alignSelf: "center",
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
