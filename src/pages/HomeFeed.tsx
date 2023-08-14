import * as React from "react";
import MContainer from "../components/MContainer/MContainer";
import PostForm from "../components/MContainer/PostForm";
import Box from "@mui/material/Box";

import { dbFireStore } from "../config/firebase";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { Post } from "../interface/PostContent";
import { User } from "../interface/User";
import { Item } from "../App";

export default function HomeFeed() {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [inFoUser, setInFoUser] = React.useState<User[]>([]);
	const [postData, setPostData] = React.useState<Post[]>([]);
	React.useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "posts"),
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
	}, []);

	React.useEffect(() => {
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
		<>
			<Item sx={{ backgroundColor: "#fff", margin: 1 }}>
				<PostForm inFoUser={inFoUser} />
			</Item>
			<Item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{postData
					.filter(
						(post) => post.status == "Friend" || post.status == "Public" ||
							inFoUser.some((user) =>
								user.friendList?.some((friend) => friend.friendId == post.owner)
							) || post.owner === userInfo.uid
					)
					.map((m) => (
						<Box key={m.id}>
							{(m.status === "Public" || m.status === "Friend") && (
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
									groupName={m.groupName}
									groupId={m.groupId}
									shareUsers={m.shareUsers}
									userInfo={inFoUser}
									location={m.location}
								/>
							)}
						</Box>
					))}
			</Item>
		</>
	);
}
