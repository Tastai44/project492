import { useState, useEffect, ChangeEvent } from "react";
import { Item } from "../App";
import "firebase/database";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";
import { Post } from "../interface/PostContent";
import Content from "../components/Report/Content";
import { EventPost } from "../interface/Event";
import EventContent from "../components/Report/EventContent";
import { Box, Stack, Typography } from "@mui/material";
import SearchBar from "../helper/SearchBar";
import { themeApp } from "../utils/Theme";

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
		<Box sx={{ width: "100%" }}>
			<Stack spacing={2}>
				<Item
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						[themeApp.breakpoints.down("md")]: {
							textAlign: "center",
							flexDirection: "column",
						},
					}}
				>
					<Box sx={{
						fontSize: "30px", color: "#920EFA", fontWeight: 500,
						[themeApp.breakpoints.down("md")]: {
							fontSize: "25px",
						},
					}}>
						Report Contents
					</Box>
					<Box sx={{
						width: "20%", [themeApp.breakpoints.down("md")]: {
							width: "100%", mr: 1.5
						},
					}}>
						<SearchBar searchValue={searchValue} handleSearch={handleSearch} backgroupColor={'#FFFFFF'} />
					</Box>

				</Item>
				{/* <Box sx={{ display: "flex", justifyContent: "center", backgroundColor: "red", }}>
					<Grid item xs={10}>
						{searchValue == ""
							? postData
								.filter(
									(item) =>
										item.reportPost.length !== 0 && item.status !== "Private"
								)
								.map((post) => (
									<Content
										key={post.id}
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
								))
							: postData
								.filter(
									(item) =>
										item.reportPost.length !== 0 &&
										item.status !== "Private" &&
										item.caption.includes(searchValue)
								)
								.map((post) => (
									<Content
										key={post.id}
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

						{searchValue == ""
							? eventData
								.filter((item) => item.reportEvent.length !== 0)
								.map((event) => (
									<EventContent
										key={event.eventId}
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
								)) : eventData
									.filter((item) => item.reportEvent.length !== 0 && item.title.includes(searchValue))
									.map((event) => (
										<EventContent
											key={event.eventId}
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

						{eventData.flatMap((e) => e.reportEvent).length == 0 &&
							postData.flatMap((s) => s.reportPost).length == 0 && (
								<Typography variant="h4" sx={{
									color: "black", [themeApp.breakpoints.down("md")]: {
										fontSize: "20px"
									},
								}}>
									There is no report content.
								</Typography>
							)}
					</Grid>
				</Box> */}

				<Box sx={{ display: "flex", flexDirection: "column" }}>
					{searchValue == ""
						? postData
							.filter(
								(item) =>
									item.reportPost.length !== 0 && item.status !== "Private"
							)
							.map((post) => (
								<Content
									key={post.id}
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
							))
						: postData
							.filter(
								(item) =>
									item.reportPost.length !== 0 &&
									item.status !== "Private" &&
									item.caption.includes(searchValue)
							)
							.map((post) => (
								<Content
									key={post.id}
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
				</Box>

				{eventData.length !== 0 && (
					<Box>
						{searchValue == ""
							? eventData
								.filter((item) => item.reportEvent.length !== 0)
								.map((event) => (
									<EventContent
										key={event.eventId}
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
								)) : eventData
									.filter((item) => item.reportEvent.length !== 0 && item.title.includes(searchValue))
									.map((event) => (
										<EventContent
											key={event.eventId}
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
					</Box>
				)}
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					{eventData.flatMap((e) => e.reportEvent).length == 0 &&
						postData.flatMap((s) => s.reportPost).length == 0 && (
							<Typography variant="h4" sx={{
								color: "black", [themeApp.breakpoints.down("md")]: {
									fontSize: "20px"
								},
							}}>
								There is no report content.
							</Typography>
						)}
				</Box>

			</Stack>
		</Box>
	);
}
