import { useState, useEffect, useMemo } from "react";
import {
	Typography,
	Divider,
	Modal,
	Paper,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Button,
	Box
} from "@mui/material";
import {
	collection,
	query,
	orderBy,
	getDocs,
	where,
	onSnapshot,
} from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import Content from "../components/MContainer/Content";
import SearchContent from "../components/TopBar/SearchContent";
import EachTopic from "../components/Topics/EachTopic";
import { dbFireStore } from "../config/firebase";
import { Post, Like } from "../interface/PostContent";
import { styleBoxPop } from "../utils/styleBox";
import { User } from "../interface/User";
import { themeApp } from "../utils/Theme";

export default function Topics() {
	const [dateType, setDateType] = useState("All");
	const [dataPost, setPosts] = useState<Post[]>([]);
	const [postId, setPostId] = useState("");
	const [reFresh, setReFresh] = useState(0);
	const [openPost, setOpenPost] = useState(false);
	const [likes, setLikes] = useState<Like[]>([]);
	const [postOwner, setPostOwner] = useState("");
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [openSearch, setOpenSearch] = useState<boolean>(false);

	const handleOpenSearch = () => {
		setOpenSearch(true);
	};
	const handleCloseSearch = () => {
		setOpenSearch(false);
	};
	const handleRefresh = () => {
		setReFresh((pre) => pre + 1);
	};
	useEffect(() => {
		const fetchData = query(
			collection(dbFireStore, "posts"),
			orderBy("createAt", "desc")
		);
		const unsubscribe = onSnapshot(
			fetchData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData);
			},
			(error) => {
				console.error("Error fetching data", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [reFresh]);

	const handletOpenPost = (id: string, likeData: Like[], owner: string) => {
		setOpenPost(true);
		setPostId(id);
		setLikes(likeData);
		setPostOwner(owner);
	};
	const handleClosePost = () => {
		setOpenPost(false);
	};

	const handleDaily = () => {
		const today = new Date().toLocaleDateString("en-US");
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "posts"),
					where("date", "==", today)
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	};

	const handleWeekly = () => {
		const today = new Date();
		const firstDayOfWeek = new Date(today);
		const dayOfWeek = today.getDay();

		firstDayOfWeek.setDate(
			today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
		);

		const lastDayOfWeek = new Date(firstDayOfWeek);
		lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

		const fetchWeeklyData = async () => {
			try {
				const startDate = firstDayOfWeek.toLocaleDateString("en-US");
				const endDate = lastDayOfWeek.toLocaleDateString("en-US");

				const q = query(
					collection(dbFireStore, "posts"),
					where("date", ">=", startDate),
					where("date", "<=", endDate)
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchWeeklyData();
	};

	const handleMonthly = () => {
		const today = new Date();
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const lastDayOfMonth = new Date(
			today.getFullYear(),
			today.getMonth() + 1,
			0
		);

		const fetchData = async () => {
			try {
				const startOfMonth = firstDayOfMonth.toLocaleDateString("en-US");
				const endOfMonth = lastDayOfMonth.toLocaleDateString("en-US");
				const q = query(
					collection(dbFireStore, "posts"),
					where("date", ">=", startOfMonth),
					where("date", "<=", endOfMonth)
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	};

	const handleDateType = (e: SelectChangeEvent) => {
		setDateType(e.target.value as string);
	};

	const [inFoUser, setInFoUser] = useState<User[]>([]);
	useMemo(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", userInfo.uid)
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
	}, [userInfo.uid]);

	return (
		<div>
			<SearchContent
				openSearchBar={openSearch}
				handleCloseSearchBar={handleCloseSearch}
				inFoUser={inFoUser}
			/>
			<Modal
				open={openPost}
				onClose={handleClosePost}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<Paper sx={styleBoxPop}>
						<Content
							postId={postId}
							userId={userInfo.uid}
							likes={likes}
							owner={postOwner}
							handleClosePost={handleClosePost}
						/>
					</Paper>
				</Box>
			</Modal>
			<Box sx={{ width: "100%", bgcolor: "background.paper", color: "black" }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						p: 1,
						[themeApp.breakpoints.down("lg")]: {
							flexDirection: "column"
						}
					}}
				>
					<Typography variant="h4" sx={{ mr: 1 }}>Topics</Typography>
					<Box
						sx={{
							display: "flex",
							gap: "5px",
							alignItems: "center"
						}}
					>
						<Button
							variant="outlined"
							startIcon={<SearchIcon />}
							sx={{
								border: "1px solid #CCCCCC",
								width: "200px",
								color: "black",
								"&:hover": {
									backgroundColor: "primary.contrastText"
								}
							}}
							onClick={handleOpenSearch}
						>
							Search...
						</Button>
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">D/W/M</InputLabel>
							<Select
								size="small"
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={dateType}
								label="D/W/M"
								onChange={handleDateType}
							>
								<MenuItem onClick={handleRefresh} value={"All"}>
									All
								</MenuItem>
								<MenuItem onClick={handleDaily} value={"Daily"}>
									Daily
								</MenuItem>
								<MenuItem onClick={handleWeekly} value={"Weekly"}>
									Weekly
								</MenuItem>
								<MenuItem onClick={handleMonthly} value={"Monthly"}>
									Monthly
								</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Box>
				<Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
				{dataPost
					.filter(
						(item) =>
							item.owner == userInfo.uid ||
							item.status == "Public" ||
							(item.status == "Friend" &&
								inFoUser.some(
									(user) =>
										user.uid === item.owner ||
										user.friendList?.some(
											(friend) => friend.friendId == item.owner
										)
								))
					)
					.map((posts) => (
						<Box
							key={posts.id}
							onClick={() =>
								handletOpenPost(posts.id, posts.likes, posts.owner)
							}
						>
							<EachTopic hashTag={posts.hashTagTopic} />
						</Box>
					))}
			</Box>
		</div>
	);
}
