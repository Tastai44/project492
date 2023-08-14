import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import Logo from "/images/logoCmu.png";
import { Avatar, Button } from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import ChatBox from "./Chat/ChatBox";
import { User } from "../interface/User";
import {
	collection,
	query,
	getDocs,
	where,
	updateDoc,
	onSnapshot,
} from "firebase/firestore";
import { dbFireStore } from "../config/firebase";
import UserMenu from "./TopBar/UserMenu";
import NotificationList from "./TopBar/NotificationList";
import PageIcons from "./TopBar/PageIcons";
import SearchContent from "./TopBar/SearchContent";

interface IData {
	open: boolean;
}
interface IFunction {
	handleOpen: () => void;
	handleClose: () => void;
}

export default function Navigation(props: IData & IFunction) {
	const navigate = useNavigate();
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [openSearch, setOpenSearch] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const [inFoUser, setInFoUser] = useState<User[]>([]);

	const handleOpenSearch = () => {
		setOpenSearch(true);
	};
	const handleCloseSearch = () => {
		setOpenSearch(false);
	};

	const handleActiveUser = async (userId: string) => {
		try {
			const q = query(
				collection(dbFireStore, "users"),
				where("uid", "==", userId)
			);
			const querySnapshot = await getDocs(q);
			const doc = querySnapshot.docs[0];
			await updateDoc(doc.ref, { isActive: false });
		} catch (error) {
			console.error("Error updating profile: ", error);
		}
	};
	const handleLogout = async () => {
		await handleActiveUser(userInfo.uid);
		signOut(auth)
			.then(() => {
				localStorage.removeItem("user");
				navigate("/login");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "users"),
			where("uid", "==", userInfo.uid)
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
	}, [userInfo.uid]);
	const IsAdmin = inFoUser.some((user) => user.userRole === "admin");

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = "primary-search-account-menu";
	const renderMenu = (
		<UserMenu
			anchorEl={anchorEl}
			menuId={menuId}
			isMenuOpen={isMenuOpen}
			inFoUser={inFoUser}
			userId={userInfo.uid ?? ""}
			handleMenuClose={handleMenuClose}
			handleLogout={handleLogout}
		/>
	);

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<NotificationList
			mobileMoreAnchorEl={mobileMoreAnchorEl}
			mobileMenuId={mobileMenuId}
			isMobileMenuOpen={isMobileMenuOpen}
			handleMobileMenuClose={handleMobileMenuClose}
		/>
	);

	return (
		<>
			{/* <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <ChatBox handleClose={props.handleClose} />
        </Box>
      </Modal> */}
			<SearchContent
				openSearchBar={openSearch}
				handleCloseSearchBar={handleCloseSearch}
				inFoUser={inFoUser}
			/>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar
					position="fixed"
					sx={{ backgroundColor: "#8E51E2", color: "black" }}
				>
					<Toolbar>
						<NavLink to="/">
							<IconButton
								size="medium"
								edge="start"
								color="inherit"
								aria-label="open drawer"
								sx={{ mr: 2 }}
							>
								<Avatar alt="CMU" src={Logo} />
							</IconButton>
						</NavLink>
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{
								display: { xs: "none", sm: "block" },
								fontWeight: "bold",
								color: "white",
							}}
						>
							CMU
						</Typography>
						<Button
							startIcon={<SearchIcon />}
							sx={{
								ml: 1, color: "black", backgroundColor: "primary.contrastText",
								"&:hover": {
									backgroundColor: "white"
								}
							}}
							onClick={handleOpenSearch}
						>
							Searching
						</Button>

						{/* Middle */}
						<Box sx={{ flexGrow: 1 }} />
						<PageIcons userId={userInfo.uid} IsAdmin={IsAdmin} />
						{/* Middle */}

						<Box sx={{ flexGrow: 1 }} />
						<Box sx={{ display: { xs: "none", md: "flex", gap: 3 } }}>
							<IconButton
								size="large"
								aria-label="show 4 new mails"
								color="inherit"
							>
								<Badge badgeContent={4} color="error">
									<MailIcon sx={{ color: "white" }} />
								</Badge>
							</IconButton>
							<IconButton
								size="large"
								aria-label="show 17 new notifications"
								color="inherit"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
							>
								<Badge badgeContent={17} color="error">
									<NotificationsIcon sx={{ color: "white" }} />
								</Badge>
							</IconButton>
							{inFoUser.map((m) => (
								<IconButton
									key={m.uid}
									size="small"
									edge="end"
									aria-label="account of current user"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									color="inherit"
								>
									<Avatar alt="Profile" src={m.profilePhoto} />
								</IconButton>
							))}
						</Box>
					</Toolbar>
				</AppBar>
				{renderMobileMenu}
				{renderMenu}
			</Box>
		</>
	);
}
