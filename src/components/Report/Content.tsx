import { useEffect, useState, MouseEvent } from "react";
import {
	Box,
	Stack,
	Avatar,
	Button,
	CardActions,
	CardContent,
	Divider,
	ImageList,
	ImageListItem,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Menu,
	Typography,
	MenuItem,
	IconButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import emojiData from "emoji-datasource-facebook";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	getDocs,
	doc,
	where,
	deleteDoc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { User } from "../../interface/User";
import { NavLink } from "react-router-dom";
import { themeApp } from "../../utils/Theme";
import PopupAlert from "../PopupAlert";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Post, PostReport } from "../../interface/PostContent";
import ReasonContainer from "./ReasonContainer";
import { Item } from "./EventContent";

interface Idata {
	caption: string;
	hashTagTopic: string;
	status: string;
	createAt?: string;
	photoPost: string[];
	emoji?: string;
	postId: string;
	owner: string;
	groupName?: string;
	groupId?: string;
	reFreshInfo: number;
	reportNumber: number;
	reportPost: PostReport[];
	imageUrls: string[];
}

export default function ReportContent(props: Idata) {
	const [openReason, setOpenReason] = useState(false);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(
		null
	);
	const [inFoUser, setInFoUser] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", props.owner)
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
	}, [props.owner, props.reFreshInfo]);

	const handleOpenReason = () => {
		setOpenReason(true);
	};
	const handleCloseReason = () => {
		setOpenReason(false);
	};

	const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
		const emoji = emojiData.find((data) => data.unified === emojiCode);
		return emoji ? emoji.name : undefined;
	};

	const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

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

	const handleDelete = (pId: string) => {
		const postRef = doc(dbFireStore, "posts", pId);
		getDoc(postRef);
		deleteDoc(postRef)
			.then(() => {
				PopupAlert("Post deleted successfully", "success");
				handleDeleteNoti(pId);
			})
			.catch((error) => {
				PopupAlert("Error deleting post", "error");
				console.error("Error deleting post: ", error);
			});
	};

	const handleApprove = async (id: string) => {
		const IndexReport = props.reportPost.findIndex(
			(index) => index.postId === props.postId
		);
		try {
			const queryPost = query(
				collection(dbFireStore, "posts"),
				where("id", "==", id)
			);
			const querySnapshot = await getDocs(queryPost);

			const doc = querySnapshot.docs[0];
			if (doc.exists()) {
				const postData = { id: doc.id, ...doc.data() } as Post;
				const updateReport = [...postData.reportPost];
				updateReport.splice(IndexReport, 1);
				const updatedData = { ...postData, reportPost: updateReport };
				await updateDoc(doc.ref, updatedData);
				PopupAlert("Report approved successfully", "success");
			} else {
				PopupAlert("No post found with the specified ID", "error");
			}
		} catch (error) {
			console.error("Error approving report:", error);
		}
	};

	return (
		<Box sx={{
			mb: 5, display: "flex", justifyContent: 'center', width: "100%"
		}}>
			<ReasonContainer
				postId={props.postId}
				openReason={openReason}
				handleCloseReason={handleCloseReason}
				reportPost={props.reportPost}
				owner={props.owner}
				imageUrls={props.imageUrls}
			/>
			{inFoUser.map((u) => (
				<Box key={u.uid} sx={{
					width: "50%", [themeApp.breakpoints.down("lg")]: {
						width: "100%"
					}
				}}>
					<Stack spacing={2}>
						<Item sx={{ display: "flex", flexDirection: "column", borderRadius: "10px" }}>
							<ListItem>
								<ListItemAvatar>
									<Avatar
										src={props.imageUrls.find((item) => item.includes(u.profilePhoto ?? ""))}
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
											<b>
												<NavLink
													to={`/profileBlog/${props.owner}`}
													style={{ color: "black", fontWeight: "bold" }}
												>
													{`${u.firstName} ${u.lastName} `}
												</NavLink>
												<NavLink
													to={`/groupDetail/${props.groupId}`}
													style={{ color: themeApp.palette.primary.main }}
												>
													{props.groupName ? ` (${props.groupName}) ` : ""}
												</NavLink>
											</b>
											{props.emoji && (
												<>
													is feeling {" "}
													{String.fromCodePoint(parseInt(props.emoji, 16))}{" "}
													{convertEmojiCodeToName(
														props.emoji
													)?.toLocaleLowerCase()}
												</>
											)}
										</Box>
									}
									secondary={
										<Typography
											sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
										>
											{props.createAt}
											{props.status === "Private" && <LockIcon />}
											{props.status === "Friend" && <GroupIcon />}
											{props.status === "Public" && <PublicIcon />}
											{props.status}
										</Typography>
									}
								/>
								<ListItemAvatar>
									<IconButton onClick={handleOpenUserMenu}>
										<MoreHorizIcon />
									</IconButton>
									<Menu
										sx={{ mt: "30px" }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										keepMounted
										transformOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										<MenuItem onClick={() => handleApprove(props.postId)}>
											<Typography
												textAlign="center"
												sx={{
													display: "flex",
													gap: 1,
													alignItems: "start",
													fontSize: "18px",
												}}
											>
												<AddTaskIcon /> Approve
											</Typography>
										</MenuItem>
										<MenuItem onClick={() => handleDelete(props.postId)}>
											<Typography
												textAlign="center"
												sx={{
													display: "flex",
													gap: 1,
													alignItems: "start",
													fontSize: "18px",
												}}
											>
												<DeleteOutlineOutlinedIcon /> Delete
											</Typography>
										</MenuItem>
									</Menu>
								</ListItemAvatar>
							</ListItem>

							<CardContent>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{
										textAlign: "justify",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "pre-wrap",
										wordWrap: "break-word",
									}}
								>
									{props.caption}
								</Typography>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{
										textAlign: "justify",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "pre-wrap",
										wordWrap: "break-word",
									}}
								>
									{props.hashTagTopic.startsWith("#")
										? props.hashTagTopic
										: `#${props.hashTagTopic}`}
								</Typography>
							</CardContent>
							{props.photoPost.length == 1 ? (
								<ImageList
									onClick={handleOpenReason}
									sx={{
										width: "100%",
										minHeight: "300px",
										maxHeight: "auto",
										justifyContent: "center",
										cursor: "pointer"
									}}
									cols={1}
								>
									{props.photoPost.map((image, index) => (
										<ImageListItem key={index} sx={{ borderRadius: '20px' }}>
											<img
												src={props.imageUrls.find((item) => item.includes(image))}
												alt={`Preview ${index}`}
												loading="lazy"
												style={{ borderRadius: '20px' }}
											/>
										</ImageListItem>
									))}
								</ImageList>
							) : (
								<ImageList
									onClick={handleOpenReason}
									variant="masonry"
									cols={2}
									gap={2}
								>
									{props.photoPost.map((image, index) => (
										<ImageListItem key={index} sx={{ borderRadius: '20px' }}>
											<img
												src={props.imageUrls.find((item) => item.includes(image))}
												alt={`Preview ${index}`}
												loading="lazy"
												style={{ borderRadius: '20px' }}
											/>
										</ImageListItem>
									))}
								</ImageList>
							)}
							<Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

							<CardActions
								disableSpacing
								sx={{ display: "flex", justifyContent: "space-between" }}
							>
								<Button aria-label="add to favorites" sx={{ color: "grey" }}>
									<FlagOutlinedIcon />
								</Button>
								<Box>
									<Button
										onClick={handleOpenReason}
										aria-label="add to favorites"
										sx={{ color: "grey" }}
									>
										{props.reportNumber} Reports
									</Button>
								</Box>
							</CardActions>
							<Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
						</Item>
					</Stack>
				</Box>
			))}
		</Box>
	);
}
