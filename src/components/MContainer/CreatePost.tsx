import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
	Avatar,
	Box,
	Button,
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
import { StorageReference, listAll, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import "firebase/database";
import { dbFireStore, storage } from "../../config/firebase";
import { Post } from "../../interface/PostContent";
import { doc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import LocationCard from "./LocationCard";
import { User } from "../../interface/User";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";
import { createNoti } from "../Functions/NotificationFunction";
import { styleCreatePost } from "../../utils/styleBox";
import heic2any from "heic2any";
import Loading from "../Loading";
import { validExtensions } from "../../helper/ImageLastName";
import { resizeImage } from "../Functions/ResizeImage";

interface IHandle {
	handleCloseCratePost: () => void;
}

export default function CreatePost({ handleCloseCratePost }: IHandle) {
	const [location, setLocation] = useState("");
	const [status, setStatus] = useState("Public");
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [openLocation, setOpenLocation] = useState(false);
	const [openEmoji, setOpenEmoji] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [emoji, setEmoji] = useState("");
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [openLoading, setLopenLoading] = useState(false);
	const [imagePath, setImagePath] = useState<string[]>([]);
	const [isHashtag, setIsHashtag] = useState(false);

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
	}, []);

	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	const handletOpenLocation = () => setOpenLocation(true);
	const handletSaveLocation = () => setOpenLocation(false);
	const handleCloseLocation = () => {
		setLocation("");
		setOpenLocation(false);
	};

	const handletOpenEmoji = () => setOpenEmoji(true);
	const handleCloseEmoji = () => setOpenEmoji(false);

	const handleClearImage = () => {
		setPreviewImages([]);
	};
	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleUpload = async (file: File) => {
		if (file == null) return;
		const resizedImage = await resizeImage(file, 800, 600);
		const fileName = removeSpacesBetweenWords(file.name);
		const imageRef = ref(storage, `Images/post_${userInfo.uid}${fileName}`);
		uploadBytes(imageRef, resizedImage).then(() => {
			setImagePath((pre) => [...pre, `post_${userInfo.uid}${fileName}`]);
		});
	};

	const handleConvertFile = async (file: File) => {
		setLopenLoading(true);
		const fileName = file.name;
		const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
		const reader = new FileReader();
		const isExtensionValid = validExtensions.includes(fileNameExt.toLowerCase());

		if (fileNameExt === 'heic' || fileNameExt === 'HEIC') {
			try {
				const resultBlob = await heic2any({ blob: file, toType: 'Image/jpg' }) as BlobPart;
				const convertedFile = new File([resultBlob], `${file.name.split('.')[0]}.jpg`, {
					type: 'Image/jpeg',
					lastModified: new Date().getTime(),
				});

				handleUpload(convertedFile);

				reader.onloadend = () => {
					setPreviewImages((prevImages) => [...prevImages, reader.result as string]);
				};

				reader.readAsDataURL(convertedFile);
			} catch (error) {
				console.error(error);
			}
		} else if (isExtensionValid) {
			reader.onloadend = () => {
				setPreviewImages((prevImages) => [...prevImages, reader.result as string]);
			};

			reader.readAsDataURL(file);
			handleUpload(file);
		} else {
			PopupAlert("Sorry, this website can only upload picture", "warning");
		}
		setLopenLoading(false);
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const fileArray = Array.from(event.target.files);
			fileArray.forEach((file) => {
				handleConvertFile(file);
			});
		}
	};

	const handleChangeEmoji = (e: string) => {
		setEmoji(e);
	};

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
		if (!post.hashTagTopic.includes("#")) {
			const newPost = {
				id: "",
				caption: post.caption,
				hashTagTopic: post.hashTagTopic,
				status: status,
				photoPost: imagePath,
				likes: [],
				createAt: new Date().toLocaleString(),
				dateCreated: serverTimestamp(),
				date: new Date().toLocaleDateString("en-US"),
				emoji: emoji,
				owner: userInfo.uid,
				shareUsers: [],
				reportPost: [],
				location: location,
				comments: post.comments,
				participants: [userInfo.uid]
			};

			try {
				const docRef = doc(postCollection);
				const postId = docRef.id;
				const updatedPost = { ...newPost, id: postId };
				if (status && post.hashTagTopic && post.caption) {
					await setDoc(docRef, updatedPost);
					if (inFoUser.flatMap((user) => user.friendList).length !== 0) {
						createNoti(
							postId, `posted ${post.caption}`, userInfo.uid, status,
							[
								...inFoUser.flatMap((user) =>
									user.friendList?.flatMap((friend) => friend.friendId) || []
								)
							]
						);
					}
					setPost(updatedPost);
					clearState();
					handleCloseCratePost();
					PopupAlert("Content was posted successfully", "success");
					setIsHashtag(false);
				} else {
					PopupAlert("Please fill in all information", "warning");
				}

			} catch (error) {
				console.error("Error adding post: ", error);
			}
		} else {
			setIsHashtag(true);
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
			<Loading
				openLoading={openLoading}
			/>
			<Box sx={styleCreatePost}>
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
									src={imageUrls.find((item) => item.includes(user.profilePhoto ?? ""))}
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

					<Typography sx={{ color: "grey", ml: 2, mb: 1 }}>{location ? `Location: ${location}` : ""}</Typography>
					<TextField
						name="caption"
						label="*What is in your mind?"
						variant="outlined"
						size="small"
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
						label="*hashtag"
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
					{isHashtag && (
						<Typography color={"error"} sx={{ ml: 2, fontSize: "14px" }}>Do not need to type #</Typography>
					)}
					{!(post.caption && post.hashTagTopic) && (
						<Typography color={"error"} sx={{ ml: 2, fontSize: "12px" }}>Please type all *require before post</Typography>
					)}

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
										accept="*"
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
								disabled={!post.caption || !post.hashTagTopic || !status}
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
