import { useState, useEffect, ChangeEvent } from "react";
import {
	Grid,
	Box,
	Divider,
	ImageList,
	ImageListItem,
	Modal,
	Paper,
	Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { dbFireStore } from "../../config/firebase";
import { Like, Post } from "../../interface/PostContent";
import {
	collection,
	query,
	orderBy,
	where,
	onSnapshot,
} from "firebase/firestore";
import Content from "../../components/MContainer/Content";
import { styleBoxPop } from "../../utils/styleBox";
import SearchPost from "../../components/Profile/SearchPost";
import SearchBar from "../../helper/SearchBar";
import { themeApp } from "../../utils/Theme";
import TabLink from "./TabLink";

export default function Collections() {
	const { userId } = useParams();
	const [postData, setPostData] = useState<Post[]>([]);
	const [openPost, setOpenPost] = useState(false);
	const [likes, setLikes] = useState<Like[]>([]);
	const [postId, setPostId] = useState("");
	const [ownerId, setOwnerId] = useState("");
	const [searchValue, setValue] = useState("");
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "posts"),
			where("owner", "==", userId),
			orderBy("createAt", "desc")
		);

		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
				setPostData(queriedData);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);

		return () => {
			unsubscribe();
		};
	}, [userId]);

	const handletOpenPost = (id: string, likeData: Like[], ownerId: string) => {
		setOpenPost(true);
		setPostId(id);
		setOwnerId(ownerId);
		setLikes(likeData);
	};
	const handleClosePost = () => {
		setOpenPost(false);
	};
	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};

	return (
		<>
			<TabLink userId={userId ?? ""} />
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
							likes={likes}
							userId={userInfo.uid}
							handleClosePost={handleClosePost}
							owner={ownerId}
						/>
					</Paper>
				</Box>
			</Modal>

			<Box sx={{ width: "100%" }}>
				<Paper
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						borderRadius: "10px"
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Box sx={{ m: 1, fontSize: "20px" }}>Collections</Box>
						<Box
							sx={{
								[themeApp.breakpoints.down("lg")]: {
									mr: 2,
								},
							}}
						>
							<SearchBar
								searchValue={searchValue}
								handleSearch={handleSearch}
							/>
						</Box>
					</Box>
					<Divider light sx={{ background: "grey", mb: 1 }} />
					{searchValue === "" ? (
						<>
							{postData.some((picture) => picture.photoPost.length !== 0) ? (
								<Grid sx={{ flexGrow: 1, gap: 1 }} container>
									<ImageList
										sx={{
											width: "100%",
											m: 1,
											cursor: "pointer"
										}}
										cols={4}
									>
										{postData.map((m) =>
											m.photoPost.map((img, index) => (
												<ImageListItem
													key={index}
													onClick={() =>
														handletOpenPost(m.id, m.likes, m.owner)
													}
												>
													<img
														src={img}
														alt={`Preview ${index}`}
														loading="lazy"
														style={{ width: "200px", height: "200px", borderRadius: "10px" }}
													/>
												</ImageListItem>
											))
										)}
									</ImageList>
								</Grid>
							) : (
								<>
									<Typography
										sx={{
											color: "primary.contrastText",
											ml: 1,
										}}
									>
										There is no data to show
									</Typography>
								</>
							)}
						</>
					) : (
						<SearchPost
							searchValue={searchValue}
							postData={postData}
							handletOpenPost={handletOpenPost}
						/>
					)}
				</Paper>
			</Box>
		</>
	);
}
