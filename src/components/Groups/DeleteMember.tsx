import { ChangeEvent, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { styleTable } from "../../utils/styleBox";
import { Avatar, Button, Typography, Divider, Box } from "@mui/material";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	updateDoc,
	doc,
	query,
	onSnapshot,
	where,
} from "firebase/firestore";
import PopupAlert from "../PopupAlert";
import SearchBar from "../../helper/SearchBar";
import { User } from "../../interface/User";

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", flex: 1 },
	{ field: "uid" },
	{
		field: "profilePhoto",
		headerName: "Profile Photo",
		renderCell: (params) => (
			<Avatar
				src={params.value}
				alt={`Profile of ${params.row.username}`}
				style={{ width: "50px", height: "50px" }}
			/>
		),
		width: 150,
		flex: 1,
	},
	{
		field: "username",
		headerName: "Full Name",
		width: 150,
		flex: 1,
	},
];

interface IData {
	members: string[];
	gId: string;
}
interface IFunction {
	handleCloseDelete: () => void;
}

export default function DeleteMember(props: IData & IFunction) {
	const [searchValue, setValue] = useState("");
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const rows = props.members.map((row, index) => {
		const matchingUser = inFoUser.find((user) => user.uid === row);
		const username = matchingUser ? `${matchingUser.firstName} ${matchingUser.lastName}` : '';
		const profilePhoto = matchingUser ? matchingUser.profilePhoto : '';

		return {
			id: `${row}_${index}`,
			uid: row,
			username: username,
			profilePhoto: profilePhoto
		};
	});

	const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "users"),
			where("uid", "in", props.members)
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
	}, [props.members]);

	const handleSelectionModelChange = (selectionModel: GridRowId[]) => {
		setSelectedRows(selectionModel);
	};

	const DeleteMember = () => {
		const postsCollection = collection(dbFireStore, "groups");
		const filteredData = rows.filter((row) => !selectedRows.includes(row.id));
		const groupRef = doc(postsCollection, props.gId);
		updateDoc(groupRef, {
			members: filteredData.map((m) => m.uid),
		})
			.then(() => {
				PopupAlert("Deleted member(s) successfully", "success");
			})
			.catch((error) => {
				console.error("Error adding likes: ", error);
			});
	};

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};

	return (
		<Box sx={styleTable}>
			<Box
				sx={{
					color: "black",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 1
				}}
			>
				<Typography id="modal-modal-title" variant="h5" sx={{ color: "black" }}>
					Delete Members
				</Typography>
				<SearchBar
					searchValue={searchValue}
					handleSearch={handleSearch}
				/>
			</Box>
			<Divider sx={{ background: "grey", mb: 1 }} />
			<DataGrid
				rows={rows}
				columns={columns}
				rowSelectionModel={selectedRows}
				onRowSelectionModelChange={handleSelectionModelChange}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
					columns: {
						columnVisibilityModel: {
							id: false,
							uid: false,
						},
					},
				}}
				pageSizeOptions={[5]}
				checkboxSelection
				disableRowSelectionOnClick
			/>
			<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
				<Button
					sx={{
						backgroundColor: "grey",
						color: "white",
						"&:hover": {
							color: "black",
							backgroundColor: "#E1E1E1",
						},
					}}
					onClick={props.handleCloseDelete}
				>
					Cancle
				</Button>
				<Button
					onClick={DeleteMember}
					sx={{
						backgroundColor: "#8E51E2",
						color: "white",
						"&:hover": {
							color: "black",
							backgroundColor: "#E1E1E1",
						},
					}}
				>
					Delete
				</Button>
			</Box>
		</Box>
	);
}
