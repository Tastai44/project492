import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Modal,
	Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { NavLink, useParams } from "react-router-dom";
import EditProfile from "./EditProfile";
import { User } from "../../interface/User";
import {
	collection,
	query,
	getDocs,
	where,
	updateDoc,
	onSnapshot,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import UploadProfile from "./UploadProfile";
import { handleAddFriend, unFriend } from "../Functions/AddUnFriend";

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

export default function ProLeftside() {
	const [open, setOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [openPre, setOpenPre] = useState(false);
	const { userId } = useParams();
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [loginUser, setLoginUser] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");

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

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "users"),
			where("uid", "==", userInfo.uid)
		);
		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as User);
				setLoginUser(queriedData);
			},
			(error) => {
				console.error("Error fetching data: ", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [userInfo.uid]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleOpenPre = () => setOpenPre(true);
	const handleClosePre = () => setOpenPre(false);

	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const handleFileChange = async (
		event: ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (files) {
			try {
				const selectedFiles = Array.from(files);
				const readerPromises = selectedFiles.map((file) => {
					return new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => {
							resolve(reader.result as string);
						};
						reader.onerror = reject;
						reader.readAsDataURL(file);
					});
				});

				const base64Images = await Promise.all(readerPromises);
				setPreviewImages(base64Images);
				handleOpenPre();
			} catch (error) {
				console.error(error);
			}
		}
	};
	const handleClearImage = () => {
		setPreviewImages([]);
		handleClosePre();
	};

	const handleEditPhotoProfile = async () => {
		try {
			const q = query(
				collection(dbFireStore, "users"),
				where("uid", "==", userId)
			);
			const querySnapshot = await getDocs(q);
			const doc = querySnapshot.docs[0];

			if (doc.exists()) {
				await updateDoc(doc.ref, {
					profilePhoto: previewImages[0],
				});
				handleClearImage();
			} else {
				console.log("Profile does not exist");
			}
		} catch (error) {
			console.error("Error updating profile: ", error);
		}
	};



	return (
		<>
			<UploadProfile
				openPre={openPre}
				previewImages={previewImages}
				handleClearImage={handleClearImage}
				handleClosePre={handleClosePre}
				handleEditPhotoProfile={handleEditPhotoProfile}
			/>
			{inFoUser.map((m) => (
				<Box key={m.uid} sx={{ display: { xs: "none", lg: "flex" } }}>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box>
							<EditProfile
								closeEdit={handleClose}
								userId={userId}
								username={m.username}
								firstName={m.firstName}
								lastName={m.lastName}
								email={m.email}
								aboutMe={m.aboutMe}
								faculty={m.faculty}
								instagram={m.instagram}
								statusDefault={m.status}
								yearDefault={m.year}
							/>
						</Box>
					</Modal>
					<div style={{ position: "fixed" }}>
						<Box sx={{ width: "100%" }}>
							<Stack spacing={2}>
								<Item>
									<Stack direction="row" spacing={2}>
										<Badge
											overlap="circular"
											anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
											badgeContent={
												<Box onClick={handleUploadClick}>
													<IconButton
														sx={{
															backgroundColor: "white",
															"&:hover": {
																color: "white",
																backgroundColor: "black",
															},
														}}
														disabled={userInfo.uid != m.uid}
													>
														<input
															type="file"
															ref={fileInputRef}
															onChange={handleFileChange}
															multiple
															hidden
															accept="image/*"
														/>
														<AddAPhotoIcon />
													</IconButton>
												</Box>
											}
										>
											<Avatar
												alt="Travis Howard"
												src={m.profilePhoto}
												sx={{ width: "186px", height: "186px" }}
											/>
										</Badge>
									</Stack>
								</Item>
								<Item
									sx={{
										display: "flex",
										flexDirection: "column",
										textAlign: "left",
										gap: "5px",
									}}
								>
									<div style={{ fontSize: "20px", fontWeight: "bold" }}>
										{m.firstName} {m.lastName}
									</div>
									<div>@{m.username}</div>
									{userInfo.uid == m.uid ? (
										<Button
											size="small"
											sx={{
												width: "30px",
												fontSize: "16px",
												alignItems: "center",
												backgroundColor: "#8E51E2",
												color: "white",
												"&:hover": {
													color: "black",
													backgroundColor: "white",
												},
											}}
											startIcon={<BorderColorOutlinedIcon sx={{ width: "16px" }} />}
											onClick={handleOpen}
										>
											Edit
										</Button>
									) : (m.friendList?.some((friend) => friend.friendId === userInfo.uid)) ? (
										<Button
											onClick={() => unFriend(inFoUser, loginUser, userId)}
											size="small"
											sx={{
												width: "100px",
												backgroundColor: "#8E51E2",
												color: "white",
												"&:hover": {
													color: "black",
													backgroundColor: "white",
												},
											}}
										>
											UnFriend
										</Button>
									) : (
										<Button
											onClick={() => handleAddFriend(userId)}
											size="small"
											sx={{
												width: "100px",
												backgroundColor: "#8E51E2",
												color: "white",
												"&:hover": {
													color: "black",
													backgroundColor: "white",
												},
											}}
										>
											Add Friend
										</Button>
									)}
								</Item>
								<Divider style={{ background: "#EAEAEA" }} />

								<Item>
									<nav aria-label="secondary mailbox folders">
										<List>
											<ListItem disablePadding>
												<NavLink
													to={`/profileBlog/${userId}`}
													style={({ isActive, isPending }) => {
														return {
															fontWeight: isPending ? "bold" : "",
															color: isActive ? "black" : "grey",
															backgroundColor: isActive ? "#B8B8B8" : "",
															width: isActive ? "100%" : "100%",
														};
													}}
												>
													<ListItemButton>
														<ListItemText primary="Blog" />
													</ListItemButton>
												</NavLink>
											</ListItem>
											<ListItem disablePadding>
												<NavLink
													to={`/aboutMe/${userId}`}
													style={({ isActive, isPending }) => {
														return {
															fontWeight: isPending ? "bold" : "",
															color: isActive ? "black" : "grey",
															backgroundColor: isActive ? "#B8B8B8" : "",
															width: isActive ? "100%" : "100%",
														};
													}}
												>
													<ListItemButton>
														<ListItemText primary="About Me" />
													</ListItemButton>
												</NavLink>
											</ListItem>
											<ListItem disablePadding>
												<NavLink
													to={`/friends/${userId}`}
													style={({ isActive, isPending }) => {
														return {
															fontWeight: isPending ? "bold" : "",
															color: isActive ? "black" : "grey",
															backgroundColor: isActive ? "#B8B8B8" : "",
															width: isActive ? "100%" : "100%",
														};
													}}
												>
													<ListItemButton>
														<ListItemText primary="Friends" />
													</ListItemButton>
												</NavLink>
											</ListItem>
											<ListItem disablePadding>
												<NavLink
													to={`/collections/${userId}`}
													style={({ isActive, isPending }) => {
														return {
															fontWeight: isPending ? "bold" : "",
															color: isActive ? "black" : "grey",
															backgroundColor: isActive ? "#B8B8B8" : "",
															width: isActive ? "100%" : "100%",
														};
													}}
												>
													<ListItemButton>
														<ListItemText primary="Collections" />
													</ListItemButton>
												</NavLink>
											</ListItem>
										</List>
									</nav>
								</Item>
							</Stack>
						</Box>
					</div>
				</Box>
			))}
		</>
	);
}
