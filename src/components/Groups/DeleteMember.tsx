import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { styleTable } from "../../utils/styleBox";
import { IMember } from "../../interface/Group";
import { Avatar, Button, Typography, Divider } from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "../Navigation";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	updateDoc,
	doc,
} from "firebase/firestore";
import PopupAlert from "../PopupAlert";


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
	members: IMember[];
	gId: string;
}
interface IFunction {
	handleCloseDelete: () => void;
	handleRefresh: () => void;
}

export default function DeleteMember(props: IData & IFunction) {

	const rows = props.members.map((row, index) => ({
		id: `${row.uid}_${index}`,
		uid: row.uid,
		username: row.username,
		profilePhoto: row.profilePhoto,
	}));
	const [selectedRows, setSelectedRows] = React.useState<GridRowId[]>([]);
	const handleSelectionModelChange = (selectionModel: GridRowId[]) => {
		setSelectedRows(selectionModel);
	};

	const DeleteMember = () => {
		const postsCollection = collection(dbFireStore, "groups");
		const filteredData = rows.filter((row) => !selectedRows.includes(row.id));
		const groupRef = doc(postsCollection, props.gId);
		updateDoc(groupRef, {
			members: filteredData.map((m) => ({
				uid: m.uid,
				username: m.username,
				profilePhoto: m.profilePhoto
			})),
		})
			.then(() => {
				props.handleRefresh();
				PopupAlert("Deleted member(s) successfully", "success");
			})
			.catch((error) => {
				console.error("Error adding likes: ", error);
			});
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
				<Search
					sx={{
						backgroundColor: "#F1F1F1",
						"&:hover": { backgroundColor: "#C5C5C5" },
					}}
				>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Search…"
						inputProps={{ "aria-label": "search" }}
					/>
				</Search>
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
