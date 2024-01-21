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
import { Conversation, GroupMessage } from "../../interface/Chat";
import Emoji from "../MContainer/Emoji";
import Header from "./Header";
import MessageBody from "./MessageBody";
import { IGroup } from "../../interface/Group";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { createGroupMessageNoti } from "../MessageNotification";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { uploadBytes, StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";
import heic2any from "heic2any";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";
import Loading from "../Loading";
import { resizeImage } from "../Functions/ResizeImage";
import { validExtensions } from "../../helper/ImageLastName";
import PopupAlert from "../PopupAlert";

interface IFunction {
	handleClose: () => void;
}

interface IData {
	groupId: string;
}

export default function GroupChatBox
	(props: IFunction & IData) {
	const [groupData, setGroupData] = useState<IGroup[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [message, setMessage] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [openEmoji, setOpenEmoji] = useState(false);
	const [messages, setMessages] = useState<GroupMessage[]>([]);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [emoji, setEmoji] = useState("");
	const [isDown, setIsDown] = useState(false);
	const [openLoading, setLopenLoading] = useState(false);
	const [imagePath, setImagePath] = useState<string[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [reFreshImage, setReFreshImage] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "groups"),
					where("gId", "==", props.groupId)
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map(
					(doc) =>
					({
						gId: doc.id,
						...doc.data(),
					} as IGroup)
				);
				setGroupData(queriedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [props.groupId]);

	useEffect(() => {
		const messagesCollectionRef = query(
			collection(dbFireStore, "groupMessages"),
			where("receiverId", "==", props.groupId),
			where("participants", "array-contains", userInfo.uid)
		);

		const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
			const messagesData = querySnapshot.docs.map(
				(doc) => doc.data() as GroupMessage
			);
			setMessages(messagesData);
		});
		return () => unsubscribe();
	}, [props.groupId, userInfo.uid]);

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
		const imageRef = ref(storage, `Images/groupChat_${userInfo.uid}${fileName}`);
		uploadBytes(imageRef, resizedImage).then(() => {
			setImagePath((pre) => [...pre, `groupChat_${userInfo.uid}${fileName}`]);
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
		const messagesCollection = collection(dbFireStore, "groupMessages");

		const querySnapshot = await getDocs(messagesCollection);
		let conversationId = "";
		let newContentMessage: Conversation[] = [];

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.content && Array.isArray(data.content)) {
				const content: Conversation[] = data.content;
				const hasPropsUserAsReceiver = content.some((con) => con.receiverId === props.groupId);

				if (hasPropsUserAsReceiver) {
					conversationId = data.conversationId;
					newContentMessage = data.content;
				}
			}
		});

		const newMessage = {
			receiverId: props.groupId,
			content: [{
				message: message,
				photoMessage: imagePath,
				emoji: emoji,
				senderId: userInfo.uid,
				receiverId: props.groupId,
			}],
			participants: groupData.flatMap(member => member.members),
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
				createGroupMessageNoti(conversationId, userInfo.uid, props.groupId, groupData.flatMap(member => member.members), message);
				clearState();
			} else {
				const docRef = doc(messagesCollection);
				conversationId = docRef.id;
				const updatedMessage = {
					...newMessage,
					conversationId: conversationId,
				};
				await setDoc(docRef, updatedMessage);
				createGroupMessageNoti(conversationId, userInfo.uid, props.groupId, groupData.flatMap(member => member.members), message);
				clearState();
			}
			setReFreshImage(pre => pre + 1);
		} catch (error) {
			console.error("Error sending message:", error);
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
					}}
				>
					<Box
						sx={{
							backgroundColor: "primary.main",
							height: "15%",
							display: "flex",
							justifyContent: "space-between",
							pl: 0.5,
						}}
					>
						<Header
							groupData={groupData}
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
							groupId={props.groupId}
							members={groupData.flatMap((member) => member.members)}
							imageUrls={imageUrls}
						/>
					</Box>
					<Divider />
					<Box
						sx={{
							height: "10%",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							alignContent: "center",
						}}
					>
						<Box sx={{ width: "auto", display: "flex" }}>
							<IconButton size="large" onClick={handleUploadClick} disabled={emoji !== '' || message !== ''}>
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
							<IconButton size="large" onClick={handletOpenEmoji} sx={{ mr: 1 }} disabled={message !== '' || previewImages.length !== 0}>
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
								height: "40px",
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
						<Box sx={{ backgroundColor: "gray", pl: 1 }}>
							Emoji: {String.fromCodePoint(parseInt(emoji, 16))}{" "}
							{convertEmojiCodeToName(emoji)}
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
		</div>
	);
}
