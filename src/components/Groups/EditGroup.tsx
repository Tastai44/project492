import { useState, useRef, ChangeEvent } from "react";
import {
	Button,
	Divider,
	FormControl,
	IconButton,
	ImageList,
	ImageListItem,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";

import "firebase/database";
import { dbFireStore, storage } from "../../config/firebase";
import { doc, updateDoc, collection, getDoc } from "firebase/firestore";
import { styleBox } from "../../utils/styleBox";
import PopupAlert from "../PopupAlert";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { uploadBytes, ref } from "firebase/storage";
import heic2any from "heic2any";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";
import Loading from "../Loading";

interface Ihandle {
	closeEdit: () => void;
	handleReFreshImage: () => void;
	imageUrls: string[];
}
interface IData {
	gId: string;
	groupName: string;
	status: string;
	details: string;
	coverPhoto: string;
}

export default function EditGroup(props: IData & Ihandle) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [status, setStatus] = useState(props.status);
	const initialState = {
		gId: props.gId,
		groupName: props.groupName,
		status: props.status,
		details: props.details,
		coverPhoto: props.coverPhoto,
	};
	const [group, setGroup] = useState<IData>(initialState);
	const [oldPicture, setOldPicture] = useState<string>(props.coverPhoto);
	const [previewImages, setPreviewImages] = useState<string>('');
	const [openLoading, setLopenLoading] = useState(false);
	const [imageUpload, setImageUpload] = useState<File | null>(null);

	const handleUpload = async () => {
		setLopenLoading(true);
		if (imageUpload == null) return;
		const fileName = removeSpacesBetweenWords(imageUpload.name);
		const imageRef = ref(storage, `Images/group_${userInfo.uid}${fileName}`);
		uploadBytes(imageRef, imageUpload).then(() => {
			props.handleReFreshImage();
		});
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setLopenLoading(true);
		const fileInput = event.target;
		const fileName = fileInput.value;
		const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
		const reader = new FileReader();

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
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			const selectedFile = event.target.files?.[0];
			if (selectedFile) {
				reader.onloadend = () => {
					setPreviewImages(reader.result as string);
				};
				reader.readAsDataURL(selectedFile);
				setImageUpload(selectedFile);
			}
		}
		setLopenLoading(false);
	};

	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleClearImage = () => {
		setPreviewImages('');
		setOldPicture('NoPhoto');
	};

	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	const clearState = () => {
		setGroup({ ...initialState });
		handleClearImage();
	};

	const handleChangeGroup = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setGroup((prevGroup) => ({
			...prevGroup,
			[name]: value,
		}));
	};

	const handleEditGroup = () => {
		setLopenLoading(true);
		const groupCollection = collection(dbFireStore, "groups");
		const updatedGroup = {
			gId: props.gId,
			hostId: userInfo.uid,
			groupName: group.groupName,
			status: status,
			details: group.details,
			coverPhoto: imageUpload !== null ? removeSpacesBetweenWords(imageUpload.name) : props.coverPhoto,
			updateAt: new Date().toLocaleString(),
		};

		if (imageUpload) {
			handleUpload();
		}

		try {
			const docRef = doc(groupCollection, props.gId);
			getDoc(docRef)
				.then(async (docSnap) => {
					if (docSnap.exists() && docSnap.data().hostId === userInfo.uid) {
						await updateDoc(docRef, updatedGroup);
						clearState();
						props.closeEdit();
						PopupAlert("Group edited successfully", "success");
						setLopenLoading(false);
					} else {
						PopupAlert("You don't have permission to delete this post", "warning");
					}
				})
				.catch((error) => {
					console.error("Error fetching post: ", error);
				});
		} catch (error) {
			console.error("Error updating post: ", error);
		}
	};

	return (
		<div style={{ color: "black" }}>
			<Loading
				openLoading={openLoading}
			/>
			<Box sx={styleBox}>
				<Typography id="modal-modal-title" variant="h5">
					Edit the group
				</Typography>
				<Divider sx={{ background: "grey" }} />
				<Box sx={{ mt: 1 }}>
					<TextField
						sx={{ width: "100%" }}
						id="outlined-basic"
						label="Group Name"
						variant="outlined"
						name="groupName"
						onChange={handleChangeGroup}
						value={group.groupName}
					/>

					<Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
						<FormControl sx={{ width: "100%" }}>
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

					<TextField
						sx={{ width: "100%", mb: 1 }}
						id="outlined-basic"
						label="Details"
						variant="outlined"
						multiline
						name="details"
						onChange={handleChangeGroup}
						value={group.details}
					/>
					<FormControl
						sx={{ width: "100%", mb: 1 }}
						variant="outlined"
						onClick={handleUploadClick}
					>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							multiple
							hidden
							accept="*"
						/>

						<Box sx={{
							p: 1, display: "flex", justifyContent: "center", textAlign: "center",
							cursor: "pointer", "&:hover": { backgroundColor: "#CCCCCC" },
							border: "1px solid #C5C5C5", borderRadius: "5px"
						}}>
							<Box sx={{ flexDirection: "column" }}>
								<Box>
									<AddAPhotoIcon />
								</Box>
								<Box>
									Add cover photo
								</Box>
							</Box>

						</Box>
					</FormControl>
				</Box>
				<Box
					sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
				>
					<Button
						sx={{
							backgroundColor: "grey",
							color: "white",
							"&:hover": {
								color: "black",
								backgroundColor: "#E1E1E1",
							},
						}}
						onClick={props.closeEdit}
					>
						Cancel
					</Button>
					<Button
						sx={{
							backgroundColor: "#8E51E2",
							color: "white",
							"&:hover": {
								color: "black",
								backgroundColor: "#E1E1E1",
							},
						}}
						onClick={handleEditGroup}
						type="submit"
					>
						Save
					</Button>
				</Box>
				{previewImages == "" ? (
					<Box>
						<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							<IconButton onClick={handleClearImage}>
								<CancelIcon />
							</IconButton>
						</Box>
						<ImageList
							sx={{ width: "100%", height: "auto", maxHeight: "400px" }}
							cols={1}
							rowHeight={160}
						>
							<ImageListItem>
								<img src={props.imageUrls.find((item) => item.includes(oldPicture))} alt={`Preview`} loading="lazy" />
							</ImageListItem>
						</ImageList>
					</Box>
				) : (
					<Box>
						<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							<IconButton onClick={handleClearImage}>
								<CancelIcon />
							</IconButton>
						</Box>
						<ImageList
							sx={{ width: "100%", height: "auto", maxHeight: "400px" }}
							cols={1}
							rowHeight={160}
						>
							<ImageListItem>
								<img src={previewImages} alt={`Preview`} loading="lazy" />
							</ImageListItem>
						</ImageList>
					</Box>
				)}
			</Box>
		</div>
	);
}
