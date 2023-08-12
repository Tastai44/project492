import React, { ChangeEvent, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Logo from "/images/logoCmu.png";
import Luffy from "/images/Luffy.webp";
import {
	Avatar,
	Divider,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	Modal,
	Tooltip,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
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
import FlagIcon from "@mui/icons-material/Flag";
import SearchBar from "../helper/SearchBar";

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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const [searchValue, setValue] = useState("");

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

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};

	const menuId = "primary-search-account-menu";
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			id={menuId}
			open={isMenuOpen}
			onClose={handleMenuClose}
			onClick={handleMenuClose}
			PaperProps={{
				elevation: 0,
				sx: {
					overflow: "visible",
					filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
					mt: 1.5,
					"& .MuiAvatar-root": {
						width: 32,
						height: 32,
						ml: -0.5,
						mr: 1,
					},
					background: "#B885FF",
					"&:before": {
						content: '""',
						display: "block",
						position: "absolute",
						top: 0,
						right: 14,
						width: 10,
						height: 10,
						bgcolor: "background.paper",
						transform: "translateY(-50%) rotate(45deg)",
						zIndex: 0,
					},
				},
			}}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
		>
			<NavLink to={`/profileBlog/${userInfo.uid}`}>
				{inFoUser.map((m) => (
					<MenuItem
						key={m.uid}
						onClick={handleMenuClose}
						sx={{
							color: "black",
							padding: "10px",
							gap: "10px",
							margin: 1,
							backgroundColor: "white",
							borderRadius: "10px",
							"&:hover": {
								color: "white",
								backgroundColor: "grey",
							},
						}}
					>
						<Avatar src={m.profilePhoto} />
						<Typography>{`${m.firstName} ${m.lastName}`}</Typography>
					</MenuItem>
				))}
			</NavLink>
			<Divider style={{ background: "white" }} />
			<MenuItem onClick={handleLogout} sx={{ padding: "20px", color: "white" }}>
				<ListItemIcon>
					<Logout fontSize="small" style={{ color: "white" }} />
				</ListItemIcon>
				Logout
			</MenuItem>
		</Menu>
	);

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			id={mobileMenuId}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
			onClick={handleMobileMenuClose}
			PaperProps={{
				elevation: 0,
				sx: {
					overflow: "visible",
					filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
					mt: 1.5,
					"& .MuiAvatar-root": {
						width: 32,
						height: 32,
						ml: -0.5,
						mr: 1,
					},
					background: "#B885FF",
					color: "white",
					"&:before": {
						content: '""',
						display: "block",
						position: "absolute",
						top: 0,
						right: 14,
						width: 10,
						height: 10,
						bgcolor: "background.paper",
						transform: "translateY(-50%) rotate(45deg)",
						zIndex: 0,
					},
				},
			}}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
		>
			<MenuItem
				sx={{
					fontSize: "20px",
					padding: "5px",
					fontWeight: "bold",
					color: "White",
					margin: 2,
					borderRadius: "10px",
				}}
			>
				Notifications
			</MenuItem>
			<Divider style={{ background: "white" }} />
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar alt="CMU" src={Luffy} />
				</ListItemAvatar>
				<ListItemText
					primary={
						<Typography
							sx={{ display: "inline" }}
							component="span"
							variant="body2"
							color="white"
							fontWeight="bold"
						>
							Username
						</Typography>
					}
					secondary={
						<React.Fragment>
							<Typography
								sx={{ display: "inline" }}
								component="span"
								variant="body2"
								color="white"
							>
								I'll be in your neighborhood doing errands this…
							</Typography>
							<br />
							{" Saturday, May 13, 2566 BE "}
						</React.Fragment>
					}
				/>
			</ListItem>
			<Divider
				variant="inset"
				component="li"
				sx={{ backgroundColor: "white" }}
			/>
		</Menu>
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

			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="fixed" sx={{ backgroundColor: "#8E51E2", color: "black" }}>
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
							sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold", color: "white" }}
						>
							CMU
						</Typography>
						<SearchBar
							searchValue={searchValue}
							handleSearch={handleSearch}
						/>

						{/* Middle */}
						<Box sx={{ flexGrow: 1 }} />
						<Box sx={{ display: { xs: "none", md: "flex", gap: 30 } }}>
							<NavLink
								to="/"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "white" : "white",
										borderBlockEnd: isActive ? "2px solid white" : "",
									};
								}}
							>
								<Tooltip title="Home">
									<HomeIcon
										sx={{
											fontSize: "30px",
											"&:hover": {
												backgroundColor: "#e8e8e8",
												color: "#8E51E2",
											},
											borderRadius: "10px",
											padding: "10px",
										}}
									/>
								</Tooltip>
							</NavLink>
							<NavLink
								to={`/friends/${userInfo.uid}`}
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "white" : "white",
										borderBlockEnd: isActive ? "2px solid white" : "",
									};
								}}
							>
								<Tooltip title="Friends">
									<PeopleAltIcon
										sx={{
											fontSize: "30px",
											"&:hover": {
												backgroundColor: "#e8e8e8",
												color: "#8E51E2",
											},
											borderRadius: "10px",
											padding: "10px",
										}}
									/>
								</Tooltip>
							</NavLink>
							<NavLink
								to={"/members"}
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "white" : "white",
										borderBlockEnd: isActive ? "2px solid white" : "",
									};
								}}
							>
								<Tooltip title="Members">
									<GroupsIcon
										sx={{
											fontSize: "30px",
											"&:hover": {
												backgroundColor: "#e8e8e8",
												color: "#8E51E2",
											},
											borderRadius: "10px",
											padding: "10px",
										}}
									/>
								</Tooltip>
							</NavLink>
							<NavLink
								to={"/events"}
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "white" : "white",
										borderBlockEnd: isActive ? "2px solid white" : "",
									};
								}}
							>
								<Tooltip title="Events">
									<DateRangeIcon
										sx={{
											fontSize: "30px",
											"&:hover": {
												backgroundColor: "#e8e8e8",
												color: "#8E51E2",
											},
											borderRadius: "10px",
											padding: "10px",
										}}
									/>
								</Tooltip>
							</NavLink>
							<NavLink
								to={"/topics"}
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "white" : "white",
										borderBlockEnd: isActive ? "2px solid white" : "",
									};
								}}
							>
								<Tooltip title="Topics">
									<TagIcon
										sx={{
											fontSize: "30px",
											"&:hover": {
												backgroundColor: "#e8e8e8",
												color: "#8E51E2",
											},
											borderRadius: "10px",
											padding: "10px",
										}}
									/>
								</Tooltip>
							</NavLink>
							<NavLink
								to="/groups"
								style={({ isActive, isPending }) => {
									return {
										fontWeight: isPending ? "bold" : "",
										color: isActive ? "white" : "white",
										borderBlockEnd: isActive ? "2px solid white" : "",
									};
								}}
							>
								<Tooltip title="Groups">
									<Diversity3Icon
										sx={{
											fontSize: "30px",
											"&:hover": {
												backgroundColor: "#e8e8e8",
												color: "#8E51E2",
											},
											borderRadius: "10px",
											padding: "10px",
										}}
									/>
								</Tooltip>
							</NavLink>
							{IsAdmin && (
								<NavLink
									to="/report"
									style={({ isActive, isPending }) => {
										return {
											fontWeight: isPending ? "bold" : "",
											color: isActive ? "white" : "white",
											borderBlockEnd: isActive ? "2px solid white" : "",
										};
									}}
								>
									<Tooltip title="Report">
										<FlagIcon
											sx={{
												fontSize: "30px",
												"&:hover": {
													backgroundColor: "#e8e8e8",
													color: "#8E51E2",
												},
												borderRadius: "10px",
												padding: "10px",
											}}
										/>
									</Tooltip>
								</NavLink>
							)}
						</Box>
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
