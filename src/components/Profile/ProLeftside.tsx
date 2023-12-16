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
import { dbFireStore, storage } from "../../config/firebase";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import UploadProfile from "./UploadProfile";
import { handleAddFriend, unFriend } from "../Functions/AddUnFriend";
import { uploadBytes, ref, StorageReference, getDownloadURL, listAll } from "firebase/storage";
import heic2any from "heic2any";
import PopupAlert from "../PopupAlert";
import { removeSpacesBetweenWords } from "./ProfileInfo";
import Loading from "../Loading";
import { validExtensions } from "../../helper/ImageLastName";
import { resizeImage } from "../Functions/ResizeImage";

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

export default function ProLeftside() {
	const [open, setOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [openPre, setOpenPre] = useState(false);
	const { userId } = useParams();
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [loginUser, setLoginUser] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [previewImages, setPreviewImages] = useState<string>('');
	const [openLoading, setLopenLoading] = useState(false);
	const [imageUpload, setImageUpload] = useState<File | null>(null);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [reFresh, setReFresh] = useState(0);

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
	}, [userId, reFresh]);

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
	}, [userInfo.uid, reFresh]);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const listRef: StorageReference = ref(storage, '/Images');
				const res = await listAll(listRef);
				const urls = await Promise.all(
					res.items.map(async (itemRef) => {
						const imageUrl = await getDownloadURL(itemRef);
						return imageUrl;
					})
				);
				setImageUrls(urls);
			} catch (error) {
				console.error('Error fetching images:', error);
			}
		};
		fetchImages();
	}, [reFresh]);


	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleOpenPre = () => setOpenPre(true);
	const handleClosePre = () => setOpenPre(false);

	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleUpload = async () => {
		setLopenLoading(true);
		if (imageUpload == null) return;
		const resizedImage = await resizeImage(imageUpload, 800, 600);
		const fileName = removeSpacesBetweenWords(imageUpload.name);
		const imageRef = ref(storage, `Images/${userId}${fileName}`);
		uploadBytes(imageRef, resizedImage).then(() => {
			handleEditPhotoProfile(`${userId}${imageUpload.name}`);
		});
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target;
		const fileName = fileInput.value;
		const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
		const reader = new FileReader();
		const isExtensionValid = validExtensions.includes(fileNameExt.toLowerCase());

		if (fileNameExt === 'heic' || fileNameExt === 'HEIC') {
			const blob = fileInput.files?.[0];
			try {
				if (blob) {
					const resultBlob = await heic2any({ blob, toType: 'image/jpg' }) as BlobPart;
					const file = new File([resultBlob], `${event.target.files?.[0].name.split('.')[0]}.jpg`, {
						type: 'image/jpeg',
						lastModified: new Date().getTime(),
					});
					setImageUpload(file);
					reader.onloadend = () => {
						setPreviewImages(reader.result as string);
					};
					reader.readAsDataURL(file);
					handleOpenPre();
				}
			} catch (error) {
				console.error(error);
			}
		} else if (isExtensionValid) {
			const selectedFile = event.target.files?.[0];
			if (selectedFile) {
				reader.onloadend = () => {
					setPreviewImages(reader.result as string);
				};
				reader.readAsDataURL(selectedFile);
				handleOpenPre();
				setImageUpload(selectedFile);
			}
		} else {
			PopupAlert("Sorry, this website can only upload picture", "warning");
		}
	};

	const handleClearImage = () => {
		setPreviewImages('');
		handleClosePre();
	};

	const handleEditPhotoProfile = async (picPatch: string) => {
		try {
			const q = query(
				collection(dbFireStore, "users"),
				where("uid", "==", userId)
			);
			const querySnapshot = await getDocs(q);
			const doc = querySnapshot.docs[0];

			if (doc.exists()) {
				await updateDoc(doc.ref, {
					profilePhoto: removeSpacesBetweenWords(picPatch),
				});
				handleClearImage();
				setReFresh(pre => pre + 1);
				PopupAlert("Upload photo successfully", "success");
				setLopenLoading(false);
			} else {
				console.log("Profile does not exist");
			}
		} catch (error) {
			console.error("Error updating profile: ", error);
		}
	};

	return (
		<>
			<Loading openLoading={openLoading} />
			<UploadProfile
				openPre={openPre}
				previewImages={previewImages}
				handleClearImage={handleClearImage}
				handleClosePre={handleClosePre}
				handleUpload={handleUpload}
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
													{userInfo.uid == m.uid && (
														<IconButton
															sx={{
																backgroundColor: "white",
																"&:hover": {
																	color: "white",
																	backgroundColor: "black",
																},
															}}
														>
															<input
																type="file"
																ref={fileInputRef}
																onChange={handleFileChange}
																multiple
																hidden
																accept="*"
															/>
															<AddAPhotoIcon />
														</IconButton>
													)}
												</Box>
											}
										>
											<Avatar
												alt="Travis Howard"
												src={imageUrls.find((item) => item.includes(m.profilePhoto ?? ""))}
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
												width: "79px",
												borderRadius: "5px",
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
											onClick={() => unFriend(inFoUser, loginUser, userId, userInfo.uid)}
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
											onClick={() => handleAddFriend(userId, userInfo.uid)}
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
															borderRadius: "10px"
														};
													}}
												>
													<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
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
															borderRadius: "10px"
														};
													}}
												>
													<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
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
															borderRadius: "10px"
														};
													}}
												>
													<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
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
															borderRadius: "10px"
														};
													}}
												>
													<ListItemButton sx={{ "&:hover": { borderRadius: "10px" } }}>
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
