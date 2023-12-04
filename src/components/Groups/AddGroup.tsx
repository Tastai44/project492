import { useState, useMemo, ChangeEvent, useRef } from "react";
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
import { IGroup } from "../../interface/Group";
import "firebase/database";
import { dbFireStore, storage } from "../../config/firebase";
import { doc, getDocs, serverTimestamp } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import { User } from "../../interface/User";
import { styleBox } from "../../utils/styleBox";
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PopupAlert from "../PopupAlert";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { uploadBytes, ref } from "firebase/storage";
import heic2any from "heic2any";
import { removeSpacesBetweenWords } from "../Profile/ProfileInfo";
import Loading from "../Loading";

interface Ihandle {
	closeEdit: () => void;
}

export default function AddGroup({ closeEdit }: Ihandle) {
	const [member, setMember] = useState<string[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [status, setStatus] = useState("");
	const [previewImages, setPreviewImages] = useState<string>('');
	const [openLoading, setLopenLoading] = useState(false);
	const [imageUpload, setImageUpload] = useState<File | null>(null);

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

	const handleUpload = async () => {
		setLopenLoading(true);
		if (imageUpload == null) return;
		const fileName = removeSpacesBetweenWords(imageUpload.name);
		const imageRef = ref(storage, `Images/group_${userInfo.uid}${fileName}`);
		uploadBytes(imageRef, imageUpload).then(() => {
			createGroup(`group_${userInfo.uid}${fileName}`);
		});
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
	};

	const handleClearImage = () => {
		setPreviewImages('');
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

	const createGroup = async (picPath: string) => {
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
			coverPhoto: removeSpacesBetweenWords(picPath),
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
			setLopenLoading(false);
		} catch (error) {
			console.error("Error adding post: ", error);
		}
	};

	return (
		<div style={{ color: "black" }}>
			<Loading
				openLoading={openLoading}
			/>
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
						onClick={handleUpload}
						type="submit"
						disabled={!group.details || !group.groupName || !member || !status || !fileInputRef}
					>
						Create
					</Button>
				</Box>
				{previewImages !== '' && (
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
