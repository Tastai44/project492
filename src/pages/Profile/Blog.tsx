import { useState, useEffect } from "react";
import {
	Grid,
	Paper,
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import MContainer from "../../components/MContainer/MContainer";
import PostForm from "../../components/MContainer/PostForm";
import { useParams } from "react-router-dom";

import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	orderBy,
	where,
	onSnapshot,
} from "firebase/firestore";
import { Post } from "../../interface/PostContent";
import { User } from "../../interface/User";
import { Item } from "../../App";
import ShareContent from "./ShareContent";
import { EventPost } from "../../interface/Event";
import ShareEvent from "../../components/Events/ShareEvent";
import TabLink from "./TabLink";

export default function Blog() {
	const { userId } = useParams();
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [type, setType] = useState("General");
	const [eventData, setEventData] = useState<EventPost[]>([]);
	const [data, setData] = useState<Post[]>([]);
	const [sharePost, setSharePost] = useState<Post[]>([]);

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
				setData(queriedData);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);
		const queryEventData = query(
			collection(dbFireStore, "events"),
			orderBy("createAt", "desc")
		);
		const eventUnsubscribe = onSnapshot(
			queryEventData,
			(snapshot) => {
				const queriedEventData = snapshot.docs.map(
					(doc) => doc.data() as EventPost
				);
				setEventData(queriedEventData);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);

		return () => {
			unsubscribe();
			eventUnsubscribe();
		};
	}, [userId]);

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "posts"),
			where("participants", "array-contains", userId),
			orderBy("createAt", "desc")
		);
		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
				setSharePost(queriedData);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [userId]);

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

	const handleChangeType = (event: SelectChangeEvent) => {
		setType(event.target.value as string);
	};

	return (
		<div>
			<TabLink
				userId={userId ?? ""}
			/>
			<Box sx={{ margin: 1, display: { xs: "block", lg: "none" } }}>
				<FormControl fullWidth sx={{ backgroundColor: "white", mb: 1, borderRadius: "10px" }}>
					<InputLabel id="demo-simple-select-label">
						Content type
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={type}
						label="Content type"
						onChange={handleChangeType}
						sx={{ borderRadius: "10px" }}
					>
						<MenuItem value={"General"}>General</MenuItem>
						<MenuItem value={"Share"}>Share</MenuItem>
					</Select>
				</FormControl>
				{userInfo.uid == userId && (
					<Box sx={{ backgroundColor: "white", p: 1 }}>
						<PostForm inFoUser={inFoUser} />
					</Box>
				)}
			</Box>

			{inFoUser.map((m) => (
				<Box sx={{ flexGrow: 1 }} key={m.uid}>
					<Grid container spacing={2}>
						<Grid item lg={9} md={12} sm={12}>
							{userInfo.uid == userId && (
								<Item sx={{ backgroundColor: "#fff", borderRadius: "10px", margin: 1, display: { xs: "none", lg: "block" } }}>
									<PostForm inFoUser={inFoUser} />
								</Item>
							)}

							{type === "General" ? (
								<Item
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 2,
									}}
								>
									{data
										.filter((f) => (f.owner === userId && f.status !== "Private") || (f.owner === userInfo.uid))
										.map((m) => (
											<Box key={m.id}>
												<MContainer
													owner={m.owner}
													groupName={m.groupName}
													groupId={m.groupId}
													postId={m.id}
													caption={m.caption}
													hashTagTopic={m.hashTagTopic}
													status={m.status}
													createAt={m.createAt}
													emoji={m.emoji}
													photoPost={m.photoPost}
													likeNumber={m.likes.length}
													likes={m.likes}
													commentNumber={m.comments.length}
													shareUsers={m.shareUsers}
													userInfo={inFoUser}
													location={m.location}
												/>
											</Box>
										))}
								</Item>
							) : (
								<>
									{
										sharePost.some((f) =>
											f.shareUsers.some(
												(share) =>
												((share.status == "Private" && (share.shareBy == userId && share.shareTo == userId)) ||
													(share.shareBy == userId && share.status == "Public"))
											)
										) && (
											<Item
												sx={{
													display: "flex",
													flexDirection: "column",
													gap: 2,
												}}
											>
												{sharePost
													.filter((f) =>
														f.shareUsers.some(
															(share) =>
															((share.status == "Private" && (share.shareBy == userId && share.shareTo == userId)) ||
																(share.shareBy == userId && share.status == "Public"))
														)
													)
													.map((m) => (
														<Box key={m.id}>
															<ShareContent
																userId={userId}
																postId={m.id}
																shareUsers={m.shareUsers.filter(
																	(share) =>
																	((share.status == "Private" && share.shareBy == userId) ||
																		(share.status == "Public" &&
																			share.shareBy == userId))
																)}
															/>
															<MContainer
																owner={m.owner}
																postId={m.id}
																caption={m.caption}
																hashTagTopic={m.hashTagTopic}
																status={m.status}
																createAt={m.createAt}
																emoji={m.emoji}
																photoPost={m.photoPost}
																likeNumber={m.likes.length}
																likes={m.likes}
																commentNumber={m.comments.length}
																shareUsers={m.shareUsers}
																userInfo={inFoUser}
																groupName={m.groupName}
																groupId={m.groupId}
																location={m.location}
															/>
														</Box>
													))}
											</Item>
										)}

									{(
										<Item
											sx={{
												display: "flex",
												flexDirection: "column",
												gap: 2,
											}}
										>
											{sharePost
												.filter((f) =>
													f.shareUsers.some(
														(share) =>
															share.shareTo == userId &&
															share.status == "Friend"
													)
												)
												.map((m) => (
													<Box key={m.id}>
														<ShareContent
															userId={m.shareUsers.find((user) => user.shareBy)?.shareBy}
															postId={m.id}
															shareUsers={m.shareUsers.filter(
																(share) =>
																	share.status == "Friend" &&
																	share.shareTo == userId
															)}
														/>
														<MContainer
															owner={m.owner}
															postId={m.id}
															caption={m.caption}
															hashTagTopic={m.hashTagTopic}
															status={m.status}
															createAt={m.createAt}
															emoji={m.emoji}
															photoPost={m.photoPost}
															likeNumber={m.likes.length}
															likes={m.likes}
															commentNumber={m.comments.length}
															shareUsers={m.shareUsers}
															userInfo={inFoUser}
															groupName={m.groupName}
															groupId={m.groupId}
															location={m.location}
														/>
													</Box>
												))}
										</Item>
									)}

									{
										eventData.some((f) =>
											f.shareUsers.some(
												(share) =>
												((share.status == "Private" && (share.shareBy == userInfo.uid && share.shareTo == userInfo.uid)) ||
													(share.shareBy == userId && share.status == "Public"))
											)
										) ? (
											<Item
												sx={{
													display: "flex",
													flexDirection: "column",
													gap: 2,
												}}
											>
												{eventData
													.filter((f) =>
														f.shareUsers.some(
															(share) =>
															((share.status == "Private" && (share.shareBy == userInfo.uid && share.shareTo == userInfo.uid)) ||
																(share.shareBy == userId && share.status == "Public"))
														)
													)
													.map((m) => (
														<Box key={m.eventId}>
															<ShareContent
																userId={userId}
																eventId={m.eventId}
																shareUsers={m.shareUsers.filter(
																	(share) =>
																		share.status == "Private" ||
																		(share.status == "Public" &&
																			share.shareBy == userId)
																)}
															/>
															<ShareEvent
																eventId={m.eventId}
																startDate={m.startDate}
																startTime={m.startTime}
																title={m.title}
																endDate={m.endDate}
																endTime={m.endTime}
																userId={m.owner}
																coverPhoto={m.coverPhoto}
															/>
														</Box>
													))}
											</Item>
										) : (
											<Item
												sx={{
													display: "flex",
													flexDirection: "column",
													gap: 2,
												}}
											>
												{eventData
													.filter((f) =>
														f.shareUsers.some(
															(share) =>
																share.shareTo == userId &&
																share.status == "Friend"
														)
													)
													.map((m) => (
														<Box key={m.eventId}>
															<ShareContent
																userId={userId}
																eventId={m.eventId}
																shareUsers={m.shareUsers.filter(
																	(share) =>
																		share.status == "Friend" &&
																		share.shareTo == userId
																)}
															/>
															<ShareEvent
																eventId={m.eventId}
																startDate={m.startDate}
																startTime={m.startTime}
																title={m.title}
																endDate={m.endDate}
																endTime={m.endTime}
																userId={m.owner}
																coverPhoto={m.coverPhoto}
															/>
														</Box>
													))}
											</Item>
										)
									}
									{data.length == 0 &&
										(eventData.filter((item) =>
											item.shareUsers.some(
												(share) =>
													share.shareBy == userInfo.uid ||
													share.shareTo == userInfo.uid
											)
										)
											.map((event) => event.shareUsers).length == 0 &&
											data
												.filter((item) =>
													item.shareUsers.some(
														(share) =>
															share.shareBy == userInfo.uid ||
															share.shareTo == userInfo.uid
													)
												)
												.map((post) => post.shareUsers).length == 0 && (
												<Typography>This is no contents to show!</Typography>
											))}
								</>
							)}
						</Grid>

						<Grid item xs={3} sx={{ display: { xs: "none", lg: "block" } }}>
							<Item>
								<FormControl fullWidth sx={{ mb: 1, backgroundColor: "white", borderRadius: "10px" }}>
									<InputLabel id="demo-simple-select-label">
										Content type
									</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={type}
										label="Content type"
										onChange={handleChangeType}
										sx={{ borderRadius: "10px" }}
									>
										<MenuItem value={"General"}>General</MenuItem>
										<MenuItem value={"Share"}>Share</MenuItem>
									</Select>
								</FormControl>
								<Paper sx={{ borderRadius: "10px" }}>
									<Typography
										sx={{
											fontSize: "16px",
											textAlign: "left",
											padding: "5px",
											fontWeight: "bold",
										}}
									>
										About me
									</Typography>
									<Typography
										sx={{
											textAlign: "left",
											padding: "10px",
											color: "#727272",
										}}
									>
										{m.aboutMe}
									</Typography>
								</Paper>
							</Item>
						</Grid>
					</Grid>
				</Box>
			))}
		</div>
	);
}
