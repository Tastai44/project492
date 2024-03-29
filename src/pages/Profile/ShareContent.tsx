import { useState, useEffect } from "react";
import {
	Box,
	Avatar,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	getDocs,
	updateDoc,
	where,
	deleteDoc
} from "firebase/firestore";
import { Post, ShareUser } from "../../interface/PostContent";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";
import PopupAlert from "../../components/PopupAlert";

interface Idata {
	postId?: string;
	eventId?: string;
	shareUsers: ShareUser[];
	userId?: string;
	imageUrls: string[];
}


export default function ShareContent(props: Idata) {
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");

	useEffect(() => {
		const shareByValue = props.shareUsers.find((share) => share.shareBy);
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", shareByValue?.shareBy)
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
	}, [props.shareUsers]);

	const handleDeleteNoti = async (pId: string) => {
		try {
			const notiData = await getDocs(
				query(collection(dbFireStore, "notifications"), where("contentId", "==", pId))
			);

			if (!notiData.empty) {
				const docSnap = notiData.docs[0];
				await deleteDoc(docSnap.ref);
				console.log("Delete noti successfully");
			} else {
				console.log("Notification not found for the given contentId");
			}
		} catch (error) {
			console.error("Error handling delete notification: ", error);
		}
	};

	const handleDeleteShare = async (postId?: string) => {
		const IndexShare = props.shareUsers.findIndex(
			(index) => index.shareBy == userInfo.uid || index.shareTo == userInfo.uid
		);
		try {
			const queryData = query(
				collection(dbFireStore, "posts"),
				where("id", "==", postId)
			);
			const querySnapshot = await getDocs(queryData);
			const doc = querySnapshot.docs[0];
			if (doc.exists()) {
				const postData = { id: doc.id, ...doc.data() } as Post;
				const updateShare = [...postData.shareUsers];
				updateShare.splice(IndexShare, 1);
				const updateData = { ...postData, shareUsers: updateShare };
				await updateDoc(doc.ref, updateData);
				PopupAlert("Deleted share content succussfully", "success");
				handleDeleteNoti(postId ?? "");
			} else {
				PopupAlert("There is no share to delete!", "warning");
				console.log("No share to delete.");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteEventShare = async (eventId?: string) => {
		const IndexShare = props.shareUsers.findIndex(
			(index) => index.shareBy == userInfo.uid || index.shareTo == userInfo.uid
		);
		try {
			const queryData = query(
				collection(dbFireStore, "events"),
				where("eventId", "==", eventId)
			);
			const querySnapshot = await getDocs(queryData);
			const doc = querySnapshot.docs[0];
			if (doc.exists()) {
				const postData = { id: doc.id, ...doc.data() } as Post;
				const updateShare = [...postData.shareUsers];
				updateShare.splice(IndexShare, 1);
				const updateData = { ...postData, shareUsers: updateShare };
				await updateDoc(doc.ref, updateData);
				PopupAlert("Deleted share content succussfully", "success");
				handleDeleteNoti(eventId ?? "");
			} else {
				PopupAlert("There is no share to delete!", "warning");
				console.log("No share to delete.");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box sx={{ backgroundColor: "primary.contrastText", borderRadius: "10px" }}>
			{props.shareUsers.map((share, index) => (
				<ListItem key={index}>
					<ListItemAvatar>
						<Avatar
							src={props.imageUrls.find((item) => item.includes((inFoUser.find((user) => user)?.profilePhoto) ?? ""))}
							sx={{
								width: "60px",
								height: "60px",
								marginRight: "10px",
							}}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Box sx={{ fontSize: "16px" }}>
								<b>Shared by</b>{" "}
								<NavLink
									to={`/profileBlog/${inFoUser.find((user) => user.firstName)?.uid
										}`}
								>
									{`${inFoUser.find((user) => user.firstName)?.firstName} ${inFoUser.find((user) => user.firstName)?.lastName
										}`}
								</NavLink>
							</Box>
						}
						secondary={
							<Typography
								sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
							>
								{share.createdAt}
								{share.status === "Private" && <LockIcon />}
								{share.status === "Friend" && <GroupIcon />}
								{share.status === "Public" && <PublicIcon />}
								{share.status}
							</Typography>
						}
					/>
					<ListItemAvatar>
						<IconButton
							disabled={
								!props.shareUsers.some(
									(share) =>
										(share.shareBy == userInfo.uid) ||
										(share.shareTo == userInfo.uid)
								)
							}
							onClick={
								(props.postId !== undefined)
									? () => handleDeleteShare(props.postId)
									: () => handleDeleteEventShare(props.eventId)
							}
						>
							<DeleteOutlineOutlinedIcon />
						</IconButton>
					</ListItemAvatar>
				</ListItem>
			))}
		</Box>
	);
}
