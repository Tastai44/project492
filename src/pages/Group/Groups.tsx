import { useState, useEffect } from "react";
import { Modal, Box, Button, Divider, Typography } from "@mui/material";
import AddGroup from "../../components/Groups/AddGroup";
import { collection, query, orderBy, onSnapshot, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IGroup } from "../../interface/Group";
import { User } from "../../interface/User";
import SearchContent from "../../components/TopBar/SearchContent";
import { NavLink } from "react-router-dom";
import EachGroup from "../../components/Groups/EachGroup";
import SearchIcon from "@mui/icons-material/Search";
import { themeApp } from "../../utils/Theme";
import Loading from "../../components/Loading";

export default function Groups() {
	const [open, setOpen] = useState(false);
	const [groupData, setGroupData] = useState<IGroup[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [openSearch, setOpenSearch] = useState<boolean>(false);
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [openLoading, setOpenLoading] = useState(false);

	useEffect(() => {
		setOpenLoading(true);
		const fetchData = query(
			collection(dbFireStore, "groups"),
			orderBy("dateCreated", "desc")
		);
		const unsubscribe = onSnapshot(
			fetchData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as IGroup);
				setGroupData(queriedData);
				setOpenLoading(false);
			},
			(error) => {
				console.error("Error fetching data", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
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

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleOpenSearch = () => {
		setOpenSearch(true);
	};
	const handleCloseSearch = () => {
		setOpenSearch(false);
	};

	return (
		<>
			<Loading
				openLoading={openLoading}
			/>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<AddGroup closeEdit={handleClose} />
				</Box>
			</Modal>
			<Box sx={{ width: "100%", bgcolor: "background.paper", color: "black", borderRadius: "10px" }}>
				<SearchContent
					openSearchBar={openSearch}
					handleCloseSearchBar={handleCloseSearch}
					inFoUser={inFoUser}
				/>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						p: 1,
						[themeApp.breakpoints.down("lg")]: {
							flexDirection: "column"
						}
					}}
				>
					<Typography variant="h4" sx={{ mr: 1 }}>Groups</Typography>
					<Box
						sx={{
							display: "flex",
							gap: "5px",
						}}
					>
						<Button
							size="small"
							variant="outlined"
							startIcon={<SearchIcon />}
							sx={{
								border: "1px solid #CCCCCC",
								width: "100px",
								color: "black",
								"&:hover": {
									backgroundColor: "primary.contrastText"
								},
								borderRadius: "20px",
							}}
							onClick={handleOpenSearch}
						>
							Search...
						</Button>
						<Button
							size="small"
							sx={{
								fontSize: "16px",
								"&:hover": { backgroundColor: "#e8e8e8", color: "black" },
								backgroundColor: "#A020F0",
								color: "#fff",
								borderRadius: "20px",
							}}
							onClick={handleOpen}
						>
							Create Group
						</Button>
					</Box>
				</Box>
				<Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
				{groupData
					.filter(
						(item) =>
							item.status === "Public" ||
							(item.hostId === userInfo.uid) ||
							item.members.some((member) => member === userInfo.uid)
					)
					.map((g) => (
						<NavLink key={g.gId} to={`/groupDetail/${g.gId}`}>
							<EachGroup title={g.groupName} />
						</NavLink>
					))}
			</Box>
		</>
	);
}
