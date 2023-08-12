import * as React from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { styleBox } from "../../utils/styleBox";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PopupAlert from "../PopupAlert";
import {
	collection,
	getDocs,
	doc,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { ChangeEvent } from "react";
import { IMember } from "../../interface/Group";

interface IFunction {
	handleClose: () => void;
}

interface IData {
	gId: string;
	hostId: string;
	members: IMember[];
}

export default function AddMembers(props: IFunction & IData) {
	const [member, setMember] = React.useState<string[]>([]);
	const [users, setUsers] = React.useState<User[]>([]);
	// const userInfo = JSON.parse(localStorage.getItem("user") || "null");

	const handleAddMember = (
		_event: ChangeEvent<unknown>,
		newValue: string[]
	) => {
		setMember(newValue);
	};

	React.useEffect(() => {
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

	const addMember = () => {
		const groupCollection = collection(dbFireStore, "groups");
		const tmp = [...member].map((m) => JSON.parse(m));
		const tmp2 = tmp.map((m) => {
			return {
				memberId: m.uid,
			};
		});
		const groupRef = doc(groupCollection, props.gId);
		updateDoc(groupRef, {
			members: arrayUnion(...tmp2),
		})
			.then(() => {
				PopupAlert("Added member(s) successfully", "success");
				props.handleClose();
			})
			.catch((error) => {
				console.error("Error adding likes: ", error);
			});
	};

	return (
		<div>
			<Box sx={styleBox}>
				<Box
					sx={{
						color: "black",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 1,
					}}
				>
					<Typography
						id="modal-modal-title"
						variant="h5"
						sx={{ color: "black" }}
					>
						Add Members
					</Typography>
				</Box>
				<Divider sx={{ background: "grey" }} />
				<Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
					<Autocomplete
						multiple
						value={member}
						onChange={handleAddMember}
						id="checkboxes-tags-demo"
						options={users
							.filter(
								(user) =>
									!props.members.some((member) => member.memberId === user.uid) && (user.uid !== props.hostId)
							)
							.map((e) => JSON.stringify(e))}
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
				<Box
					sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}
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
						onClick={props.handleClose}
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
						onClick={addMember}
						type="submit"
					>
						Add
					</Button>
				</Box>
			</Box>
		</div>
	);
}
