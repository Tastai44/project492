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
import { User } from "../interface/User";
import {
	collection,
	query,
	getDocs,
	where,
	updateDoc,
	onSnapshot,
	orderBy,
	limit
} from "firebase/firestore";
import { dbFireStore } from "../config/firebase";
import UserMenu from "./TopBar/UserMenu";
import NotificationList from "./TopBar/NotificationList";
import PageIcons from "./TopBar/PageIcons";
import SearchContent from "./TopBar/SearchContent";
import { IGroupMessageNoti, IMessageNoti, INoti } from "../interface/Notification";
import MessageNoti from "./TopBar/MessageNoti";

export default function Navigation() {
	const navigate = useNavigate();
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [openSearch, setOpenSearch] = useState<boolean>(false);

	const [openMessageNoti, setOpenMessageNoti] = useState<null | HTMLElement>(null);
	const isMessageMenuOpen = Boolean(openMessageNoti);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [notifications, setNotifications] = useState<INoti[]>();
	const [messageNoti, setMessageNoti] = useState<IMessageNoti[]>();
	const [groupMessageNoti, setGroupMessageNoti] = useState<IGroupMessageNoti[]>();

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

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "notifications"),
			orderBy("createAt", "desc"),
			limit(5)
		);
		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as INoti);
				setNotifications(queriedData);
			},
			(error) => {
				console.error("Error fetching data: ", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "messageNotifications"),
			where("receiverId", "==", userInfo.uid),
			orderBy("createAt", "desc"),
			limit(5)
		);
		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as IMessageNoti);
				setMessageNoti(queriedData);
			},
			(error) => {
				console.error("Error fetching data: ", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [userInfo.uid]);

	useEffect(() => {
		const queryData = query(
			collection(dbFireStore, "groupMessageNotications"),
			orderBy("createAt", "desc"),
			limit(5)
		);
		const unsubscribe = onSnapshot(
			queryData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as IGroupMessageNoti);
				setGroupMessageNoti(queriedData);
			},
			(error) => {
				console.error("Error fetching data: ", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, []);


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

	const handleOpenMessageNoti = (event: React.MouseEvent<HTMLElement>) => {
		setOpenMessageNoti(event.currentTarget);
	};
	const handleCloseMessageNoti = () => {
		setOpenMessageNoti(null);
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
			notifications={notifications ?? []}
			handleMobileMenuClose={handleMobileMenuClose}
		/>
	);

	const messageNotiList = "primary-message-account-menu-mobile";
	const renderMessageNoti = (
		<MessageNoti
			openMessageNoti={openMessageNoti}
			messageNotiList={messageNotiList}
			isMessageMenuOpen={isMessageMenuOpen}
			messageNoti={messageNoti ?? []}
			groupMessageNoti={groupMessageNoti ?? []}
			handleCloseMessageNoti={handleCloseMessageNoti}
		/>
	);

	const IsAdmin = inFoUser.some((user) => user.userRole === "admin");

	return (
		<>
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
								aria-controls={messageNotiList}
								aria-haspopup="true"
								onClick={handleOpenMessageNoti}
							>
								<Badge badgeContent={messageNoti?.filter((messNoti) => !messNoti.isRead).length} color="error">
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
								<Badge badgeContent={notifications?.length} color="error">
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
				{renderMessageNoti}
			</Box>
		</>
	);
}
