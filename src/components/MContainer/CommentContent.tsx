import { useState, ChangeEvent, useEffect } from "react";
import {
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Box,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Modal,
	Button,
	TextField,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	getDocs,
	where,
	updateDoc,
	doc,
	getDoc,
	deleteDoc
} from "firebase/firestore";
import { Post } from "../../interface/PostContent";
import { User } from "../../interface/User";
import { styleCommentBox } from "../../utils/styleBox";

interface IData {
	text: string;
	createAt: string;
	commentIndex: number;
	postId: string;
	userId: string;
	author: string;
	imageUrls: string[];
}

export default function CommentContent(props: IData) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(
		null
	);
	const [openEditCom, setOpenEditCom] = useState(false);
	const [comment, setComment] = useState({
		text: props.text
	});
	const [inFoUser, setInFoUser] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", props.author)
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
	}, [props.author]);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handletOpenEditCom = () => {
		handleCloseUserMenu();
		setOpenEditCom(true);
	};
	const handleCloseEditCom = () => setOpenEditCom(false);

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

	const handleDelete = async (id: string, comId: number) => {
		try {
			const q = query(
				collection(dbFireStore, "posts"),
				where("id", "==", id)
			);
			const querySnapshot = await getDocs(q);
			const doc = querySnapshot.docs[0];
			if (doc.exists()) {
				const postData = { id: doc.id, ...doc.data() } as Post;
				const updatedComments = [...postData.comments];
				if (updatedComments[comId].author === props.userId) {
					updatedComments.splice(comId, 1);
					const updatedData = { ...postData, comments: updatedComments };
					await updateDoc(doc.ref, updatedData);
					handleCloseUserMenu();
					handleDeleteNoti(id);
				} else {
					handleCloseUserMenu();
					alert("You don't have permission to delete this comment");
					return;
				}
			} else {
				console.log("No post found with the specified ID");
			}
		} catch (error) {
			console.error("Error deleting comment:", error);
		}
	};

	const handleChangeComment = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setComment((prevComment) => ({
			...prevComment,
			[name]: value,
		}));
	};

	const editComment = () => {
		const postsCollection = collection(dbFireStore, "posts");
		const postRef = doc(postsCollection, props.postId);
		const getDocPromise = getDoc(postRef);
		const updateCommentPromise = getDocPromise.then((doc) => {
			if (doc.exists()) {
				const comments = doc.data().comments;
				if (props.commentIndex >= 0 && props.commentIndex < comments.length) {
					if (comments[props.commentIndex].author === props.userId) {
						comments[props.commentIndex].text = comment.text;
						comments[props.commentIndex].updateAt = new Date().toLocaleString();
					} else {
						setComment({ text: comments[props.commentIndex].text });
						alert("You don't have permission to edit this comment");
						return;
					}

				} else {
					throw new Error("Invalid comment index.");
				}

				return updateDoc(postRef, { comments: comments });
			} else {
				throw new Error("Post document does not exist.");
			}
		});
		updateCommentPromise
			.then(() => {
				handleCloseEditCom();
			})
			.catch((error) => {
				console.error("Error updating comment: ", error);
			});
	};

	return (
		<Box>
			<Modal
				open={openEditCom}
				onClose={handleCloseEditCom}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<Paper sx={styleCommentBox}>
						<Typography sx={{ fontSize: "30px" }}>Edit Comment</Typography>
						<Box
							sx={{
								width: "98%",
								display: "flex",
								flexDirection: "column",
								gap: 1,
							}}
						>
							<TextField
								name="text"
								size="small"
								id="outlined-basic"
								label="Comment something..."
								variant="outlined"
								multiline
								maxRows={4}
								sx={{ width: "100%" }}
								value={comment.text}
								onChange={handleChangeComment}
							/>
							<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
								<Button
									size="small"
									variant="contained"
									sx={{
										backgroundColor: "primary.contrastText",
										color: "black",
										"&:hover": {
											color: "black",
											backgroundColor: "#E1E1E1",
										},
										maxHeight: "40px",
									}}
									onClick={handleCloseEditCom}
								>
									Cancel
								</Button>
								<Button
									size="small"
									variant="contained"
									onClick={editComment}
									sx={{
										backgroundColor: "primary.main",
										color: "white",
										"&:hover": {
											color: "black",
											backgroundColor: "#E1E1E1",
										},
										maxHeight: "40px",
									}}
									type="submit"
								>
									Save
								</Button>
							</Box>
						</Box>
					</Paper>
				</Box>
			</Modal>
			<Paper sx={{ backgroundColor: "primary.contrastText", mb: 1, borderRadius: "10px" }}>
				{inFoUser.map((user) => (
					<ListItem key={user.uid}>
						<ListItemAvatar>
							<Avatar
								src={props.imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))}
								sx={{ width: "40px", height: "40px" }}
							/>
						</ListItemAvatar>
						<ListItemText
							primary={
								<Box sx={{ fontSize: "16px" }}>
									<b>{user.firstName} {user.lastName}</b>
								</Box>
							}
							secondary={
								<Typography
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										fontSize: "12px",
									}}
								>
									{props.createAt}
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
								<MenuItem onClick={handletOpenEditCom} disabled={props.author !== userInfo.uid}>
									<Typography
										textAlign="center"
										sx={{
											display: "flex",
											gap: 1,
											alignItems: "start",
											fontSize: "18px",
										}}
									>
										<BorderColorOutlinedIcon /> Edit
									</Typography>
								</MenuItem>
								<MenuItem onClick={() => handleDelete(props.postId, props.commentIndex)} disabled={props.author !== userInfo.uid}>
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
								{/* <MenuItem onClick={handleCloseUserMenu}>
									<Typography
										textAlign="center"
										sx={{
											display: "flex",
											gap: 1,
											alignItems: "start",
											fontSize: "18px",
										}}
									>
										<FlagOutlinedIcon /> Report
									</Typography>
								</MenuItem> */}
							</Menu>
						</ListItemAvatar>
					</ListItem>
				))}
				<Box sx={{ ml: 2, pb: 1 }}>{props.text}</Box>
			</Paper>
		</Box>
	);
}
