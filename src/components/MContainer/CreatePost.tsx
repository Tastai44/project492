import { useState, useRef, ChangeEvent, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
	Avatar,
	IconButton,
	InputLabel,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Modal,
	TextField,
	MenuItem,
	ImageList,
	ImageListItem,
	Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import Emoji from "./Emoji";
import emojiData from "emoji-datasource-facebook";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { Post } from "../../interface/PostContent";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import LocationCard from "./LocationCard";
import { User } from "../../interface/User";
import { createNoti } from "../NotificationFunction";

const styleBoxPop = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	color: "black",
	p: 4,
};

interface IHandle {
	handleCloseCratePost: () => void;
}

export default function CreatePost({ handleCloseCratePost }: IHandle) {
	const [location, setLocation] = useState("");
	const [status, setStatus] = useState("");
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	const [openLocation, setOpenLocation] = useState(false);
	const handletOpenLocation = () => setOpenLocation(true);
	const handletSaveLocation = () => setOpenLocation(false);
	const handleCloseLocation = () => setOpenLocation(false);

	const [openEmoji, setOpenEmoji] = useState(false);
	const handletOpenEmoji = () => setOpenEmoji(true);
	const handleCloseEmoji = () => setOpenEmoji(false);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");

	const handleClearImage = () => {
		setPreviewImages([]);
	};
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
			} catch (error) {
				console.error(error);
			}
		}
	};

	const [emoji, setEmoji] = useState("");
	const handleChangeEmoji = (e: string) => {
		setEmoji(e);
	};

	const initialState = {
		id: "",
		caption: "",
		hashTagTopic: "",
		status: "",
		photoPost: [],
		comments: [],
		likes: [],
		createAt: "",
		emoji: "",
		owner: "",
		shareUsers: [],
		reportPost: [],
	};
	const [post, setPost] = useState<Post>(initialState);
	const clearState = () => {
		setPost({ ...initialState });
		setStatus('');
		setEmoji('');
		handleClearImage();
	};

	const handleChangePost = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setPost((prevPost) => ({
			...prevPost,
			[name]: value,
		}));
	};

	const createPost = async () => {
		const postCollection = collection(dbFireStore, "posts");
		const newPost = {
			id: "",
			caption: post.caption,
			hashTagTopic: post.hashTagTopic,
			status: status,
			photoPost: previewImages,
			likes: [],
			createAt: new Date().toLocaleString(),
			date: new Date().toLocaleDateString("en-US"),
			emoji: emoji,
			owner: userInfo.uid,
			shareUsers: [],
			reportPost: [],
			location: location,
			comments: post.comments,
		};

		try {
			const docRef = doc(postCollection);
			const postId = docRef.id;
			const updatedPost = { ...newPost, id: postId };
			await setDoc(docRef, updatedPost);

			createNoti(
				postId, `posted ${post.caption}`, userInfo.uid
			);
			setPost(updatedPost);
			clearState();
			PopupAlert("Content was posted successfully", "success");
		} catch (error) {
			console.error("Error adding post: ", error);
		}
	};

	const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
		const emoji = emojiData.find((data) => data.unified === emojiCode);
		return emoji ? emoji.name : undefined;
	};

	const handleChangeLocation = (
		_event: ChangeEvent<unknown>,
		newValue: string | null
	) => {
		if (newValue) {
			setLocation(newValue);
		}
	};

	useEffect(() => {
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
		<div>
			<Modal
				open={openEmoji}
				onClose={handleCloseEmoji}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<Emoji
						handleClose={handleCloseEmoji}
						handleChangeEmoji={handleChangeEmoji}
					/>
				</Box>
			</Modal>
			<LocationCard
				openLocation={openLocation}
				location={location}
				handleCloseLocation={handleCloseLocation}
				handletSaveLocation={handletSaveLocation}
				handleChangeLocation={handleChangeLocation}
			/>
			<Box sx={styleBoxPop}>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box
						id="modal-modal-title"
						sx={{ fontSize: "25px", fontWeight: "500" }}
					>
						Create A Post
					</Box>
					<Box>
						<IconButton onClick={handleCloseCratePost}>
							<CancelIcon />
						</IconButton>
					</Box>
				</Box>
				<Box>
					{inFoUser.map((user) => (
						<ListItem key={user.uid}>
							<ListItemAvatar>
								<Avatar
									src={user.profilePhoto}
									sx={{ width: "40px", height: "40px", marginRight: "10px" }}
								/>
							</ListItemAvatar>
							<ListItemText
								primary={
									<Box sx={{ fontSize: "16px" }}>
										<Box>
											<b>{`${user.firstName} ${user.lastName}`} </b>
											{emoji !== "" && (
												<>{String.fromCodePoint(parseInt(emoji, 16))} {convertEmojiCodeToName(emoji)}</>
											)}
										</Box>
										<FormControl size="small" sx={{ width: "130px" }}>
											<InputLabel id="demo-simple-select">Status</InputLabel>
											<Select
												label="Status"
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={status}
												onChange={handleChange}
											>
												<MenuItem value={"Private"}>
													<Box
														sx={{
															display: "flex",
															alignContent: "end",
															gap: 0.5,
														}}
													>
														<LockIcon /> Private
													</Box>
												</MenuItem>
												<MenuItem value={"Friend"}>
													<Box
														sx={{
															display: "flex",
															alignContent: "end",
															gap: 0.5,
														}}
													>
														<GroupIcon /> Friend
													</Box>
												</MenuItem>
												<MenuItem value={"Public"}>
													<Box
														sx={{
															display: "flex",
															alignContent: "end",
															gap: 0.5,
														}}
													>
														<PublicIcon /> Public
													</Box>
												</MenuItem>
											</Select>
										</FormControl>
									</Box>
								}
							/>
						</ListItem>
					))}

					<Typography sx={{ color: "red", ml: 2, mb: 1 }}>{location ? `Location: ${location}` : ""}</Typography>
					<TextField
						name="caption"
						label="What is in your mind?"
						variant="outlined"
						multiline
						maxRows={4}
						sx={{
							width: "99%",
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									borderColor: "transparent",
								},
								"&:hover fieldset": {
									borderColor: "transparent",
								},
								"&.Mui-focused fieldset": {
									borderColor: "transparent",
								},
							},
						}}
						value={post.caption}
						onChange={handleChangePost}
					/>
					<TextField
						name="hashTagTopic"
						id="outlined-basic"
						label="#hashtag"
						variant="outlined"
						maxRows={4}
						sx={{
							width: "99%",
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									borderColor: "transparent",
								},
								"&:hover fieldset": {
									borderColor: "transparent",
								},
								"&.Mui-focused fieldset": {
									borderColor: "transparent",
								},
							},
						}}
						value={post.hashTagTopic}
						onChange={handleChangePost}
					/>

					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<Box sx={{ display: "flex", gap: 1 }}>
							<Box onClick={handleUploadClick}>
								<IconButton size="large">
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										multiple
										hidden
									/>
									<InsertPhotoIcon sx={{ color: "green" }} />
								</IconButton>
							</Box>
							<IconButton size="large" onClick={handletOpenLocation}>
								<LocationOnIcon color="error" />
							</IconButton>
							<IconButton onClick={handletOpenEmoji} size="large">
								<EmojiEmotionsIcon sx={{ color: "#FCE205" }} />
							</IconButton>
						</Box>
						<Box>
							<Button
								variant="contained"
								onClick={createPost}
								sx={{
									backgroundColor: "#8E51E2",
									color: "white",
									"&:hover": {
										color: "black",
										backgroundColor: "#E1E1E1",
									},
								}}
								type="submit"
							>
								Post
							</Button>
						</Box>
					</Box>
					{previewImages.length !== 0 && (
						<Box>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<IconButton onClick={handleClearImage}>
									<CancelIcon />
								</IconButton>
							</Box>
							<ImageList sx={{ width: "100%", height: "auto", maxHeight: "500px" }} cols={3} rowHeight={164}>
								{previewImages.map((image, index) => (
									<ImageListItem key={index}>
										<img src={image} alt={`Preview ${index}`} loading="lazy" />
									</ImageListItem>
								))}
							</ImageList>
						</Box>
					)}
				</Box>
			</Box>
		</div>
	);
}
