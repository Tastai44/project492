import { useState, useEffect } from "react";
import {
	Typography,
	Divider,
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
import SearchContent from "../components/TopBar/SearchContent";
import EachTopic from "../components/Topics/EachTopic";
import { dbFireStore } from "../config/firebase";
import { Post } from "../interface/PostContent";
import { User } from "../interface/User";
import { themeApp } from "../utils/Theme";
import Loading from "../components/Loading";
import { NavLink } from "react-router-dom";

export default function Topics() {
	const [dateType, setDateType] = useState("All");
	const [dataPost, setPosts] = useState<Post[]>([]);
	const [uniquePosts, setUniquePosts] = useState<Post[]>([]);
	const [reFresh, setReFresh] = useState(0);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [openSearch, setOpenSearch] = useState<boolean>(false);
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [openLoading, setOpenLoading] = useState(false);

	useEffect(() => {
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

	useEffect(() => {
		setOpenLoading(true);
		const fetchData = query(
			collection(dbFireStore, "posts"),
			orderBy("createAt", "desc"),
		);
		const unsubscribe = onSnapshot(
			fetchData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData);
				setOpenLoading(false);
			},
			(error) => {
				console.error("Error fetching data", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [reFresh]);

	useEffect(() => {
		const uniqueData = Array.from(
			new Set(
				dataPost
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
					.map((posts) => posts.hashTagTopic)
			)
		)
			.map((uniqueHashtag) => dataPost.find((post) => post.hashTagTopic === uniqueHashtag))
			.filter((post) => post !== undefined) as Post[]; // Type assertion to remove undefined values

		setUniquePosts(uniqueData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataPost]);


	const handleOpenSearch = () => {
		setOpenSearch(true);
	};
	const handleCloseSearch = () => {
		setOpenSearch(false);
	};
	const handleRefresh = () => {
		setReFresh((pre) => pre + 1);
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
		const startDate = firstDayOfWeek.toLocaleDateString("en-US");
		const endDate = lastDayOfWeek.toLocaleDateString("en-US");

		const fetchWeeklyData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "posts")
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData.filter((post) => new Date(post.date ?? "") >= new Date(startDate) && new Date(post.date ?? "") <= new Date(endDate)));
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
					collection(dbFireStore, "posts")
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
				setPosts(queriedData.filter((post) => new Date(post.date ?? "") >= new Date(startOfMonth) && new Date(post.date ?? "") <= new Date(endOfMonth)));
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	};

	const handleDateType = (e: SelectChangeEvent) => {
		setDateType(e.target.value as string);
	};

	return (
		<div>
			<Loading
				openLoading={openLoading}
			/>
			<SearchContent
				openSearchBar={openSearch}
				handleCloseSearchBar={handleCloseSearch}
				inFoUser={inFoUser}
			/>
			<Box sx={{ width: "100%", bgcolor: "background.paper", color: "black", borderRadius: "10px" }}>
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
								borderRadius: "20px",
								"&:hover": {
									backgroundColor: "white"
								},
							}}
							onClick={handleOpenSearch}
						>
							Search...
						</Button>
						<FormControl fullWidth sx={{ borderRadius: "20px" }} >
							<InputLabel id="demo-simple-select-label">D/W/M</InputLabel>
							<Select
								sx={{ borderRadius: "20px" }}
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
				<Box sx={{ maxHeight: "500px", overflow: "auto" }}>
					{uniquePosts
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
							>
								<NavLink to={`/hashtag/${posts.hashTagTopic}`}>
									<EachTopic hashTag={posts.hashTagTopic} />
								</NavLink>
							</Box>
						))}
				</Box>
			</Box>
		</div>
	);
}
