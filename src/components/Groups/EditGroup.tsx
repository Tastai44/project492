import {
	Button,
	Divider,
	FormControl,
	IconButton,
	ImageList,
	ImageListItem,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import React from "react";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { doc, updateDoc, collection, getDoc } from "firebase/firestore";
import { styleBox } from "../../utils/styleBox";
import PopupAlert from "../PopupAlert";

interface Ihandle {
	closeEdit: () => void;
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

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = React.useState<string[]>([
		props.coverPhoto,
	]);
	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
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
	const handleClearImage = () => {
		setPreviewImages([]);
	};

	const [status, setStatus] = React.useState(props.status);
	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	const initialState = {
		gId: props.gId,
		groupName: props.groupName,
		status: props.status,
		details: props.details,
		coverPhoto: props.coverPhoto,
	};
	const [group, setGroup] = React.useState<IData>(initialState);
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
		const groupCollection = collection(dbFireStore, "groups");
		const updatedGroup = {
			gId: props.gId,
			hostId: userInfo.uid,
			groupName: group.groupName,
			status: status,
			details: group.details,
			coverPhoto: previewImages[0],
			updateAt: new Date().toLocaleString(),
		};
		try {
			const docRef = doc(groupCollection, props.gId);
			getDoc(docRef)
				.then(async (docSnap) => {
					if (docSnap.exists() && docSnap.data().hostId === userInfo.uid) {
						await updateDoc(docRef, updatedGroup);
						clearState();
						props.closeEdit();
						PopupAlert("Group edited successfully", "success");
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
			<Box sx={styleBox}>
				<Typography id="modal-modal-title" variant="h5">
					Create a group
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
						<OutlinedInput
							id="outlined-insertPhoto"
							type={"file"}
							inputProps={{ "aria-label": " " }}
							ref={fileInputRef}
							onChange={handleFileChange}
							endAdornment={
								<InputAdornment position="end" sx={{ fontSize: "20px" }}>
									Cover photo
								</InputAdornment>
							}
						/>
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
				{previewImages.length !== 0 && (
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
							{previewImages.map((image, index) => (
								<ImageListItem key={index}>
									<img src={image} alt={`Preview ${index}`} loading="lazy" />
								</ImageListItem>
							))}
						</ImageList>
					</Box>
				)}
			</Box>
		</div>
	);
}
