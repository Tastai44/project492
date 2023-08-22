
import {
	Box,
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
import { dbFireStore } from "../../config/firebase";
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
	arrayUnion,
} from "firebase/firestore";
import { Conversation, GroupMessage } from "../../interface/Chat";
import Emoji from "../MContainer/Emoji";
import Header from "./Header";
import MessageBody from "./MessageBody";
import { IGroup } from "../../interface/Group";
import { useState, useRef, ChangeEvent, useMemo, useEffect } from "react";
import { createGroupMessageNoti } from "../MessageNotification";

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
	const handletOpenEmoji = () => setOpenEmoji(true);
	const handleCloseEmoji = () => setOpenEmoji(false);
	const handleClearImage = () => {
		setPreviewImages([]);
	};
	const [emoji, setEmoji] = useState("");
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

	const handleMessage = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { value } = event.target;
		setMessage(value);
	};

	useMemo(() => {
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

	const [messages, setMessages] = useState<GroupMessage[]>([]);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

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

	const clearState = () => {
		setMessage('');
		setEmoji('');
		setPreviewImages([]);
	};

	const handleSendMessage = async () => {
		const messagesCollection = collection(dbFireStore, "groupMessages");

		const querySnapshot = await getDocs(messagesCollection);
		let conversationId = "";

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.content && Array.isArray(data.content)) {
				const content: Conversation[] = data.content;

				// const hasUserAsSender = content.some((con) => con.senderId === userInfo.uid);
				// const hasUserAsReceiver = content.some((con) => con.receiverId === userInfo.uid);
				// const hasPropsUserAsSender = content.some((con) => con.senderId === props.groupId);
				const hasPropsUserAsReceiver = content.some((con) => con.receiverId === props.groupId);

				if (hasPropsUserAsReceiver) {
					conversationId = data.conversationId;
				}
			}
		});

		const newMessage = {
			receiverId: props.groupId,
			content: [{
				message: message,
				photoMessage: previewImages,
				emoji: emoji,
				senderId: userInfo.uid,
				receiverId: props.groupId,
			}],
			participants: groupData.flatMap(member => member.members),
			createAt: serverTimestamp(),
			timestamp: new Date().toLocaleString(),
		};

		try {
			if (conversationId) {
				const conversationDocRef = doc(messagesCollection, conversationId);
				await updateDoc(conversationDocRef, {
					content: arrayUnion(newMessage.content[0]),
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
						<Header groupData={groupData} />
						<Box sx={{ p: 0.2 }}>
							<IconButton size="small" onClick={props.handleClose}>
								<CancelIcon sx={{ color: "white", fontSize: "20px" }} />
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
						/>
					</Box>
					<Box
						sx={{
							height: "10%",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							alignContent: "center",
							mt: 1,
						}}
					>
						<Box sx={{ width: "30%" }}>
							<IconButton size="large" onClick={handleUploadClick}>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileChange}
									multiple
									hidden
								/>
								<CameraAltOutlinedIcon
									sx={{ color: "primary.main", fontSize: "20px" }}
								/>
							</IconButton>
							<IconButton onClick={handletOpenEmoji}>
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
