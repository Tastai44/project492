import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Typography, Box } from "@mui/material";
import { dbFireStore, storage } from "../../config/firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { User } from "../../interface/User";
import { ref, listAll, getDownloadURL, StorageReference } from "firebase/storage";

export const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "ripple 1.2s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}));

interface IData {
	username?: string;
	userId?: string;
	members?: string[];
	profilePhoto?: string;
}

export default function UserCard(props: IData) {
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", props.userId)
				);
				onSnapshot(q, (querySnapshot) => {
					const queriedData = querySnapshot.docs.map(
						(doc) =>
						({
							uid: doc.id,
							...doc.data(),
						} as User)
					);
					setInFoUser(queriedData);
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		if (props.userId) {
			fetchData();
		}
	}, [props.userId]);

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
		<Stack
			direction="row"
			spacing={2}
			sx={{
				p: 1,
				display: "flex",
				alignItems: "center",
				marginBottom: "10px",
				"&:hover": {
					backgroundColor: "#F1F1F1",
					color: "black",
				},
			}}
		>
			{inFoUser.filter((item) => item.uid == props.userId).length !== 0 ? (
				<>
					{inFoUser
						.filter((item) => item.uid == props.userId)
						.map((u) => (
							<Box
								key={u.uid}
								sx={{ display: "flex", alignItems: "center", gap: 1 }}
							>
								<StyledBadge
									overlap="circular"
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									variant={u.isActive ? "dot" : "standard"}
								>
									<Avatar alt="Remy Sharp" src={imageUrls.find((item) => item.includes(u.profilePhoto ?? ""))} />
								</StyledBadge>

								<Typography sx={{ fontSize: "16px" }}>
									{u.username !== null ? u.firstName + " " + u.lastName : ""}
								</Typography>
							</Box>
						))}
				</>
			) : (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Avatar alt="Remy Sharp" src={imageUrls.find((item) => item.includes(props.profilePhoto ?? ""))} />
					<Typography sx={{ fontSize: "16px" }}>{props.username}</Typography>
				</Box>
			)}
		</Stack>
	);
}
