import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
	Box,
	Divider,
	IconButton,
	ImageList,
	ImageListItem,
	Modal,
	Paper,
	TextField,
} from "@mui/material";
import { styleBoxChat } from "../../utils/styleBox";
import CancelIcon from "@mui/icons-material/Cancel";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import emojiData from "emoji-datasource-facebook";
import "firebase/database";
import { dbFireStore, storage } from "../../config/firebase";
import {
	collection,
	query,
	getDocs,
	where,
	doc,
	setDoc,
	onSnapshot,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { User } from "../../interface/User";
import { Conversation, Message } from "../../interface/Chat";
import Emoji from "../MContainer/Emoji";
import Header from "./Header";
import MessageBody from "./MessageBody";
import { createMessageNoti } from "../MessageNotification";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { uploadBytes, StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";
import heic2any from "heic2any";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";
import Loading from "../Loading";
import { resizeImage } from "../Functions/ResizeImage";
import PopupAlert from "../PopupAlert";
import { validExtensions } from "../../helper/ImageLastName";

interface IFunction {
	handleClose: () => void;
}

interface IData {
	uId: string;
}

export default function ChatBox(props: IFunction & IData) {
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [message, setMessage] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [openEmoji, setOpenEmoji] = useState(false);
	const [emoji, setEmoji] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [isDown, setIsDown] = useState(false);
	const [openLoading, setLopenLoading] = useState(false);
	const [imagePath, setImagePath] = useState<string[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [reFreshImage, setReFreshImage] = useState(0);

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "users"),
			where("uid", "==", props.uId)
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
	}, [props.uId]);

	useEffect(() => {
		const messagesCollectionRef = query(
			collection(dbFireStore, "messages"),
			where("participants", "array-contains", userInfo.uid),
		);
		const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
			const messagesData = querySnapshot.docs.map(
				(doc) => doc.data() as Message
			);
			setMessages(messagesData);
		});

		return () => unsubscribe();

	}, [messages, userInfo.uid]);

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
	}, [reFreshImage]);

	const scrollDown = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
			setIsDown(true);
		}
	};

	const scrollUp = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = 0;
			setIsDown(false);
		}
	};

	const handletOpenEmoji = () => setOpenEmoji(true);
	const handleCloseEmoji = () => setOpenEmoji(false);

	const handleClearImage = () => {
		setPreviewImages([]);
		setImagePath([]);
	};
	const handleClearEmoji = () => {
		setEmoji("");
	};

	const handleChangeEmoji = (e: string) => {
		setEmoji(e);
	};
	const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
		const emoji = emojiData.find((data) => data.unified === emojiCode);
		return emoji ? emoji.name : undefined;
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
		const imageRef = ref(storage, `Images/chat_${userInfo.uid}${fileName}`);
		uploadBytes(imageRef, resizedImage).then(() => {
			setImagePath((pre) => [...pre, `chat_${userInfo.uid}${fileName}`]);
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
			setMessage('');
			const fileArray = Array.from(event.target.files);
			fileArray.forEach((file) => {
				handleConvertFile(file);
			});
		}
	};

	const handleMessage = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { value } = event.target;
		setMessage(value);
	};

	const clearState = () => {
		setMessage('');
		setEmoji('');
		setPreviewImages([]);
		setImagePath([]);
	};

	const handleSendMessage = async () => {
		const messagesCollection = collection(dbFireStore, "messages");

		const querySnapshot = await getDocs(messagesCollection);
		let conversationId = "";
		let newContentMessage: Conversation[] = [];

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const content: Conversation[] = data.content;

			const hasUserAsSender = content.some((con) => con.senderId === userInfo.uid);
			const hasUserAsReceiver = content.some((con) => con.receiverId === userInfo.uid);

			const hasPropsUserAsSender = content.some((con) => con.senderId === props.uId);
			const hasPropsUserAsReceiver = content.some((con) => con.receiverId === props.uId);

			if ((hasUserAsSender && hasPropsUserAsReceiver) || (hasPropsUserAsSender && hasUserAsReceiver)) {
				conversationId = data.conversationId;
				newContentMessage = data.content;
			}
		});

		const newMessage = {
			senderId: userInfo.uid,
			content: [{
				message: (imagePath.length == 0) ? message : "",
				photoMessage: imagePath,
				emoji: emoji,
				senderId: userInfo.uid,
				receiverId: props.uId,
			}],
			participants: [
				userInfo.uid,
				props.uId,
			],
			createAt: serverTimestamp(),
			timestamp: new Date().toLocaleString(),
		};
		newContentMessage.push(newMessage.content[0]);

		try {
			if (conversationId) {
				const conversationDocRef = doc(messagesCollection, conversationId);
				await updateDoc(conversationDocRef, {
					content: newContentMessage,
				});
				createMessageNoti(conversationId, userInfo.uid, props.uId, message);
				clearState();
			} else {
				const docRef = doc(messagesCollection);
				conversationId = docRef.id;
				const updatedMessage = {
					...newMessage,
					conversationId: conversationId,
				};
				await setDoc(docRef, updatedMessage);
				createMessageNoti(conversationId, userInfo.uid, props.uId, message);
				clearState();
			}
			setReFreshImage(pre => pre + 1);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	return (
		<>
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
			<Loading
				openLoading={openLoading}
			/>
			<Paper sx={styleBoxChat}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
						justifyContent: "space-between",
						color: "white",
						borderRadius: "10px"
					}}
				>
					<Box
						sx={{
							backgroundColor: "primary.main",
							height: "15%",
							display: "flex",
							justifyContent: "space-between",
							pl: 0.5,
							borderRadius: "10px"
						}}
					>
						<Header
							inFoUser={inFoUser}
							imageUrls={imageUrls}
						/>
						<Box sx={{ p: 0.2, display: "flex", flexDirection: "column" }}>
							<IconButton size="small" onClick={props.handleClose} sx={{ p: 1 }}>
								<CancelIcon sx={{ color: "white", fontSize: "20px" }} />
							</IconButton>
							<IconButton size="small" onClick={isDown ? scrollUp : scrollDown} sx={{ color: "white" }}>
								{isDown ? <ArrowCircleUpIcon /> : <ArrowCircleDownIcon />}
							</IconButton>
						</Box>
					</Box>
					<Box
						sx={{
							backgroundColor: "white",
							height: "70%",
							display: "flex",
							flexDirection: "column",
							overflowY: "auto",
						}}
						ref={chatContainerRef}
					>
						<MessageBody
							messages={messages}
							uId={props.uId}
							userProfile={
								imageUrls.find((item) => item.includes(inFoUser.find((item) => item.profilePhoto)?.profilePhoto ?? ""))
							}
							imageUrls={imageUrls}
						/>
					</Box>
					<Divider />
					<Box
						sx={{
							height: "10%",
							width: "100%",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							alignContent: "center",
						}}
					>
						<Box sx={{ width: "auto", display: "flex" }}>
							<IconButton size="large" onClick={handleUploadClick}>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileChange}
									multiple
									hidden
									accept="*"
								/>
								<CameraAltOutlinedIcon
									sx={{ color: "primary.main", fontSize: "20px" }}
								/>
							</IconButton>
							<IconButton size="large" onClick={handletOpenEmoji} sx={{ mr: 1 }}>
								<EmojiEmotionsIcon
									sx={{ color: "primary.main", fontSize: "20px" }}
								/>
							</IconButton>
						</Box>
						<TextField
							size="small"
							name="message"
							variant="outlined"
							multiline
							maxRows={1}
							sx={{
								borderRadius: "10px",
								minHeight: "40px",
								backgroundColor: "primary.contrastText",
								overflow: "auto",
								width: "100%",
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
							disabled={emoji !== '' || previewImages.length !== 0}
							value={message}
							onChange={handleMessage}
						/>
						<IconButton
							onClick={handleSendMessage}
							type="submit"
						>
							<SendOutlinedIcon
								sx={{ color: "primary.main", fontSize: "20px" }}
							/>
						</IconButton>
					</Box>

					{emoji !== "" && (
						<Box sx={{ backgroundColor: "gray", pl: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
							<Box>
								Emoji: {String.fromCodePoint(parseInt(emoji, 16))}{" "}
								{convertEmojiCodeToName(emoji)}
							</Box>
							<IconButton onClick={handleClearEmoji}>
								<CancelIcon style={{ color: "white" }} />
							</IconButton>
						</Box>
					)}

					{previewImages.length !== 0 && (
						<Box>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<IconButton onClick={handleClearImage}>
									<CancelIcon />
								</IconButton>
							</Box>
							<ImageList
								sx={{
									width: "100%",
									height: "auto",
									maxHeight: "500px",
								}}
								cols={3}
								rowHeight={100}
							>
								{previewImages.map((image, index) => (
									<ImageListItem key={index}>
										<img src={image} alt={`Preview ${index}`} loading="lazy" />
									</ImageListItem>
								))}
							</ImageList>
						</Box>
					)}
				</Box>
			</Paper>
		</ >
	);
}
