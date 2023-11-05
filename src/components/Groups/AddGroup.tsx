import { useState, useMemo, ChangeEvent, useRef } from "react";
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
import { IGroup } from "../../interface/Group";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { doc, getDocs, serverTimestamp } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import { User } from "../../interface/User";
import { styleBox } from "../../utils/styleBox";
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PopupAlert from "../PopupAlert";

interface Ihandle {
	closeEdit: () => void;
}

export default function AddGroup({ closeEdit }: Ihandle) {
	const [member, setMember] = useState<string[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [status, setStatus] = useState("");
	const initialState = {
		gId: "",
		hostId: "",
		groupName: "",
		members: [],
		status: "",
		details: "",
		coverPhoto: "",
		createAt: "",
	};
	const [group, setGroup] = useState<IGroup>(initialState);

	useMemo(() => {
		const fetchData = async () => {
			try {
				const q = collection(dbFireStore, "users");
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map(
					(doc) =>
					({
						uid: doc.id,
						...doc.data(),
					} as User)
				);
				setUsers(queriedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleAddMember = (
		_event: ChangeEvent<unknown>,
		newValue: string[]
	) => {
		setMember(newValue);
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
	const handleClearImage = () => {
		setPreviewImages([]);
	};

	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	const clearState = () => {
		setGroup({ ...initialState });
		handleClearImage();
	};

	const handleChangeGroup = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setGroup((prevGroup) => ({
			...prevGroup,
			[name]: value,
		}));
	};

	const createGroup = async () => {
		const postCollection = collection(dbFireStore, "groups");
		const tmp = [...member].map((m) => JSON.parse(m));
		const tmp2 = tmp.map((m) => m.uid);
		const newPost = {
			gId: "",
			hostId: userInfo.uid,
			groupName: group.groupName,
			members: [...tmp2, userInfo.uid],
			status: status,
			details: group.details,
			coverPhoto: previewImages[0],
			createAt: new Date().toLocaleString(),
			dateCreated: serverTimestamp(),
		};

		try {
			const docRef = doc(postCollection);
			const groupId = docRef.id;
			const updatedPost = { ...newPost, gId: groupId };
			await setDoc(docRef, updatedPost);

			setGroup(updatedPost);
			clearState();
			PopupAlert("Group Successfully Added", "success");
			closeEdit();
		} catch (error) {
			console.error("Error adding post: ", error);
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
						<Autocomplete
							multiple
							value={member}
							onChange={handleAddMember}
							id="checkboxes-tags-demo"
							options={users.filter((user) => user.uid !== userInfo.uid).map((e) => JSON.stringify(e))}
							disableCloseOnSelect
							getOptionLabel={(option) => {
								const temp = JSON.parse(option);
								return `${temp.firstName + " " + temp.lastName}`;
							}}
							renderOption={(props, option, { selected }) => {
								const temp = JSON.parse(option);
								return (
									<li {...props}>
										<Checkbox
											icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
											checkedIcon={<CheckBoxIcon fontSize="small" />}
											checked={selected}
											style={{ marginRight: 8 }}
										/>
										{`${temp.firstName} ${temp.lastName}`}
									</li>
								);
							}}
							style={{ width: 500 }}
							renderInput={(params) => (
								<TextField {...params} label="Members" placeholder="Members" />
							)}
						/>

					</Box>

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
						onClick={closeEdit}
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
						onClick={createGroup}
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
