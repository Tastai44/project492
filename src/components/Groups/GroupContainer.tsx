// import * as React from "react";
import Box from "@mui/material/Box";

import EachGroup from "./EachGroup";
import { Typography, Button, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import { IGroup } from "../../interface/Group";
import { useMemo, useState } from "react";
import SearchContent from "../TopBar/SearchContent";
import SearchIcon from "@mui/icons-material/Search";
import { collection, where, getDocs, query } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";

interface IFunction {
	openAddGroup: () => void;
}
interface IData {
	groupData: IGroup[];
}

export default function GroupContainer({
	openAddGroup,
	groupData,
}: IFunction & IData) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [openSearch, setOpenSearch] = useState<boolean>(false);

	const handleOpenSearch = () => {
		setOpenSearch(true);
	};
	const handleCloseSearch = () => {
		setOpenSearch(false);
	};

	const [inFoUser, setInFoUser] = useState<User[]>([]);
	useMemo(() => {
		const fetchData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "users"),
					where("uid", "==", userInfo.uid)
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map(
					(doc) =>
					({
						uid: doc.id,
						...doc.data(),
					} as User)
				);
				setInFoUser(queriedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [userInfo.uid]);
	return (
		<Box sx={{ width: "100%", bgcolor: "background.paper", color: "black" }}>
			<SearchContent
				openSearchBar={openSearch}
				handleCloseSearchBar={handleCloseSearch}
				inFoUser={inFoUser}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					padding: 10,
				}}
			>
				<Typography variant="h4">Groups</Typography>
				<Box
					sx={{
						display: "flex",
						gap: "5px",
					}}
				>
					<Button
						variant="outlined"
						startIcon={<SearchIcon />}
						sx={{
							border: "1px solid #CCCCCC",
							width: "100px",
							color: "black",
							"&:hover": {
								backgroundColor: "primary.contrastText"
							}
						}}
						onClick={handleOpenSearch}
					>
						Search...
					</Button>
					<Button
						sx={{
							fontSize: "16px",
							"&:hover": { backgroundColor: "#e8e8e8", color: "black" },
							borderRadius: "10px",
							backgroundColor: "#A020F0",
							padding: "5px",
							color: "#fff",
						}}
						onClick={openAddGroup}
					>
						Create Group
					</Button>
				</Box>
			</div>
			<Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
			{groupData
				.filter(
					(item) =>
						item.status === "Public" ||
						(item.hostId === userInfo.uid) ||
						item.members.some((member) => member.memberId === userInfo.uid)
				)
				.map((g) => (
					<NavLink key={g.gId} to={`/groupDetail/${g.gId}`}>
						<EachGroup title={g.groupName} />
					</NavLink>
				))}
		</Box>
	);
}
