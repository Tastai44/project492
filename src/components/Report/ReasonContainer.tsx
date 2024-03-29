import { useState, useEffect, MouseEvent } from "react";
import {
	styled,
	Grid,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	CardContent,
	ImageList,
	ImageListItem,
	Button,
	CardActions,
	Modal,
	Box,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import emojiData from "emoji-datasource-facebook";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import CancelIcon from "@mui/icons-material/Cancel";
import Divider from "@mui/material/Divider";
import AddTaskIcon from "@mui/icons-material/AddTask";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import "firebase/database";
import { Post, PostReport } from "../../interface/PostContent";

import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	getDocs,
	doc,
	where,
	getDoc,
	deleteDoc,
	updateDoc,
	onSnapshot,
	orderBy
} from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import { styleBoxPop } from "../../utils/styleBox";
import ReasonContent from "./ReasonContent";
import { User } from "../../interface/User";

const Item = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

interface IData {
	postId: string;
	openReason: boolean;
	reportPost: PostReport[];
	owner: string;
}
interface IFunction {
	handleCloseReason: () => void;
	imageUrls: string[];
}

export default function ReasonContainer(props: IData & IFunction) {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(
		null
	);
	const [postData, setPostData] = useState<Post[]>([]);
	const [inFoUser, setInFoUser] = useState<User[]>([]);

	useEffect(() => {
		const q = query(
			collection(dbFireStore, "posts"),
			where("id", "==", props.postId),
			orderBy("createAt", "desc")
		);

		const unsubscribe = onSnapshot(
			q,
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
	}, [props.postId]);

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
	}, [props.owner]);

	const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
		const emoji = emojiData.find((data) => data.unified === emojiCode);
		return emoji ? emoji.name : undefined;
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
				PopupAlert("Error deleting post", error);
			});
	};

	const handleApprove = async (id: string) => {
		const IndexReport = props.reportPost.findIndex((index) => index.postId === props.postId);
		try {
			const queryPost = query(collection(dbFireStore, "posts"), where("id", "==", id));
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
		<>
			<Modal
				open={props.openReason}
				onClose={props.handleCloseReason}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={styleBoxPop}>
					<IconButton onClick={props.handleCloseReason}>
						<CancelIcon />
					</IconButton>
					{postData
						.map((post) => (
							<Box key={post.id} sx={{ flexGrow: 1, p: 1 }}>
								<Grid container spacing={1}>
									<Grid item lg={6} md={12}>
										<Item>
											<Box
												sx={{ height: "auto", maxWidth: "lg", minWidth: "sm" }}
											>
												{post.photoPost.length == 1 ? (
													<>
														<ImageList variant="masonry" cols={1}>
															{post.photoPost.map((image, index) => (
																<ImageListItem key={index}>
																	<img
																		src={props.imageUrls.find((item) => item.includes(image))}
																		alt={`${index}`}
																		loading="lazy"
																		style={{ borderRadius: '20px' }}
																	/>
																</ImageListItem>
															))}
														</ImageList>
													</>
												) : (
													<ImageList variant="masonry" cols={2} gap={10}>
														{post.photoPost.map((image, index) => (
															<ImageListItem key={index}>
																<img
																	src={props.imageUrls.find((item) => item.includes(image))}
																	alt={`${index}`}
																	loading="lazy"
																	style={{ borderRadius: '20px' }}
																/>
															</ImageListItem>
														))}
													</ImageList>
												)}
											</Box>
										</Item>
									</Grid>
									<Grid item lg={post.photoPost.length !== 0 ? 6 : 12} md={12}>
										<Item>
											<Box sx={{ display: "flex", flexDirection: "column" }}>
												<Box>
													{inFoUser.map((user) => (
														<ListItem key={user.uid}>
															<ListItemAvatar>
																<Avatar
																	src={props.imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))}
																	sx={{
																		width: "60px",
																		height: "60px",
																		marginRight: "10px",
																	}}
																/>
															</ListItemAvatar>
															<ListItemText
																primary={
																	<Typography sx={{ fontSize: "16px" }}>
																		<b>{`${user.firstName} ${user.lastName} `}</b>
																		{post.emoji && (
																			<>
																				is feeling{" "}
																				{String.fromCodePoint(
																					parseInt(post.emoji, 16)
																				)}{" "}
																				{convertEmojiCodeToName(
																					post.emoji
																				)?.toLocaleLowerCase()}
																			</>
																		)}
																	</Typography>
																}
																secondary={
																	<Typography
																		sx={{
																			display: "flex",
																			alignItems: "center",
																			gap: 0.5,
																		}}
																	>
																		{post.createAt}
																		{post.status === "Private" && <LockIcon />}
																		{post.status === "Friend" && <GroupIcon />}
																		{post.status === "Public" && <PublicIcon />}
																		{post.status}
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
																	<MenuItem
																		onClick={() => handleApprove(props.postId)}
																	>
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
																	<MenuItem
																		onClick={() => handleDelete(props.postId)}
																	>
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
													))}

													<CardContent>
														<Typography
															variant="body1"
															color="text.secondary"
															sx={{ textAlign: "justify" }}
														>
															{post.caption}
														</Typography>
													</CardContent>
													<Box
														sx={{
															fontSize: "16px",
															display: "flex",
															justifyContent: "start",
															margin: 1,
														}}
													>
														{post.hashTagTopic}
													</Box>
												</Box>
												<Divider
													style={{ background: "#EAEAEA", marginBottom: 10 }}
												/>
												<CardActions
													disableSpacing
													sx={{
														display: "flex",
														justifyContent: "space-between",
													}}
												>
													<Button
														aria-label="add to favorites"
														sx={{ color: "grey" }}
													>
														<FlagOutlinedIcon />
													</Button>
													<Box>
														<Button
															aria-label="add to favorites"
															sx={{ color: "grey" }}
														>
															{props.reportPost.length} Reports
														</Button>
													</Box>
												</CardActions>
												<Divider
													style={{ background: "#EAEAEA", marginBottom: 10 }}
												/>
												<Box
													sx={{
														mt: 2,
														mb: 2,
														height: "380px",
														maxHeight: "500px",
														overflowY: "auto",
													}}
												>
													{post.reportPost.length !== 0 ? (
														<>
															{post.reportPost.map((report, index) => (
																<Box key={index}>
																	<ReasonContent
																		text={report.reason}
																		createAt={report.createAt}
																		userId={report.uid}
																		imageUrls={props.imageUrls}
																	/>
																</Box>
															))}
														</>
													) : (
														<Box>There are report reasons!</Box>
													)}
												</Box>
											</Box>
										</Item>
									</Grid>
								</Grid>
							</Box>
						))}
				</Box>
			</Modal>
		</>
	);
}
