import { useState, useEffect } from "react";
import {
	styled,
	Paper,
	Box,
	Avatar,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { NavLink } from "react-router-dom";
import { User } from "../interface/User";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbFireStore, storage } from "../config/firebase";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

export default function LeftSide() {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const IsAdmin = inFoUser.some((user) => user.userRole === "admin");
	const [imageUrls, setImageUrls] = useState<string[]>([]);

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
		<Box sx={{ width: "100%", display: { xs: "none", lg: "flex" } }}>
			<Box sx={{ width: "100%", flexDirection: "column", ml: 5 }}>
				<NavLink to={`/profileBlog/${userInfo.uid}`}>
					{inFoUser.map((user) => (
						<Item
							key={user.uid}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: "10px",
								fontWeight: "bold",
								borderRadius: "10px",
								"&:hover": { backgroundColor: "#F1F1F1" }
							}}
						>
							<Avatar alt="Remy Sharp" src={imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))} />
							{user.firstName} {user.lastName}
						</Item>
					))}
				</NavLink>

				<Paper sx={{ backgroundColor: "#FFF", mt: 1, p: 1, borderRadius: "10px" }}>
					<List>
						<ListItem disablePadding>
							<NavLink
								to="/"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "black" : "grey",
										backgroundColor: isActive ? "#F1F1F1" : "",
										width: isActive ? "100%" : "100%",
										borderRadius: "10px",
									};
								}}
							>
								<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
									<ListItemIcon>
										<HomeIcon />
									</ListItemIcon>
									<ListItemText primary="Home" />
								</ListItemButton>
							</NavLink>
						</ListItem>

						<ListItem disablePadding>
							<NavLink
								to={`/friends/${userInfo.uid}`}
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "black" : "grey",
										backgroundColor: isActive ? "#F1F1F1" : "",
										width: isActive ? "100%" : "100%",
										borderRadius: "10px",
									};
								}}
							>
								<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
									<ListItemIcon>
										<PeopleAltIcon />
									</ListItemIcon>
									<ListItemText primary="Friends" />
								</ListItemButton>
							</NavLink>
						</ListItem>

						<ListItem disablePadding>
							<NavLink
								to="/members"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "black" : "grey",
										backgroundColor: isActive ? "#F1F1F1" : "",
										width: isActive ? "100%" : "100%",
										borderRadius: "10px",
									};
								}}
							>
								<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
									<ListItemIcon>
										<GroupsIcon />
									</ListItemIcon>
									<ListItemText primary="Members" />
								</ListItemButton>
							</NavLink>
						</ListItem>

						<ListItem disablePadding>
							<NavLink
								to="/events"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "black" : "grey",
										backgroundColor: isActive ? "#F1F1F1" : "",
										width: isActive ? "100%" : "100%",
										borderRadius: "10px",
									};
								}}
							>
								<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
									<ListItemIcon>
										<DateRangeIcon />
									</ListItemIcon>
									<ListItemText primary="Events" />
								</ListItemButton>
							</NavLink>
						</ListItem>

						<ListItem disablePadding>
							<NavLink
								to="/topics"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "black" : "grey",
										backgroundColor: isActive ? "#F1F1F1" : "",
										width: isActive ? "100%" : "100%",
										borderRadius: "10px",
									};
								}}
							>
								<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
									<ListItemIcon>
										<TagIcon />
									</ListItemIcon>
									<ListItemText primary="Topics" />
								</ListItemButton>
							</NavLink>
						</ListItem>
						<ListItem disablePadding>
							<NavLink
								to="/groups"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "black" : "grey",
										backgroundColor: isActive ? "#F1F1F1" : "",
										width: isActive ? "100%" : "100%",
										borderRadius: "10px",
									};
								}}
							>
								<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
									<ListItemIcon>
										<Diversity3Icon />
									</ListItemIcon>
									<ListItemText primary="Groups" />
								</ListItemButton>
							</NavLink>
						</ListItem>

						{IsAdmin && (
							<ListItem disablePadding>
								<NavLink
									to="/Report"
									style={({ isActive, isPending }) => {
										return {
											fontWeight: isPending ? "bold" : "",
											color: isActive ? "black" : "grey",
											backgroundColor: isActive ? "#F1F1F1" : "",
											width: isActive ? "100%" : "100%",
											borderRadius: "10px",
										};
									}}
								>
									<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
										<ListItemIcon>
											<FlagIcon />
										</ListItemIcon>
										<ListItemText primary="Reports" />
									</ListItemButton>
								</NavLink>
							</ListItem>
						)}

					</List>
				</Paper>
			</Box>
		</Box >
	);
}
