import { useState, useEffect, ChangeEvent } from "react";
import { Item } from "../App";
import "firebase/database";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";
import { Post } from "../interface/PostContent";
import Content from "../components/Report/Content";
import { EventPost } from "../interface/Event";
import EventContent from "../components/Report/EventContent";
import { Box, Stack, Grid, Typography } from "@mui/material";
import SearchBar from "../helper/SearchBar";

export default function ReportContent() {
	const [postData, setPostData] = useState<Post[]>([]);
	const [eventData, setEventData] = useState<EventPost[]>([]);
	const [searchValue, setValue] = useState("");
	useEffect(() => {
		const queryPostData = query(
			collection(dbFireStore, "posts"),
			orderBy("createAt", "desc")
		);
		const postUnsubscribe = onSnapshot(
			queryPostData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
				setPostData(queriedData);
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
				const queriedData = snapshot.docs.map((doc) => doc.data() as EventPost);
				setEventData(queriedData);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);

		return () => {
			postUnsubscribe();
			eventUnsubscribe();
		};
	}, []);

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};
	return (
		<Box sx={{ width: "100%", marginTop: 7 }}>
			<Stack spacing={2}>
				<Item
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ fontSize: "30px", color: "#920EFA", fontWeight: 500 }}>
						Report Contents
					</div>
					<SearchBar
						searchValue={searchValue}
						handleSearch={handleSearch}
					/>
				</Item>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Grid item xs={10}>
						{postData.some((s) => s.reportPost.length !== 0) ? (
							<>
								{postData
									.filter((item) => item.reportPost.length !== 0)
									.map((post) => (
										<Content
											owner={post.owner}
											postId={post.id}
											caption={post.caption}
											hashTagTopic={post.hashTagTopic}
											status={post.status}
											createAt={post.createAt}
											emoji={post.emoji}
											photoPost={post.photoPost}
											groupName={post.groupName}
											groupId={post.groupId}
											reportNumber={post.reportPost.length}
											reFreshInfo={0}
											reportPost={post.reportPost}
										/>
									))}
							</>
						) : (
							<Typography variant="h4" sx={{ color: "black" }}>
								There is no report post.
							</Typography>
						)}

						{eventData.some((e) => e.reportEvent.length !== 0) ? (
							<>
								{eventData
									.filter((item) => item.reportEvent.length !== 0)
									.map((event) => (
										<EventContent
											ownerId={event.owner}
											details={event.details}
											status={event.status}
											eventId={event.eventId}
											title={event.title}
											topic={event.topic}
											createAt={event.createAt ?? ""}
											coverPhoto={event.coverPhoto}
											reportNumber={event.reportEvent.length}
											reportEvent={event.reportEvent ?? []}
										/>
									))}
							</>
						) : (
							<Typography variant="h4" sx={{ color: "black" }}>
								There is no report event.
							</Typography>
						)}
					</Grid>
				</Box>
			</Stack>
		</Box>
	);
}
