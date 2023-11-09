import { useState } from "react";
import { Box, Button, Card, CardMedia, Divider, Modal } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import DateRangeIcon from "@mui/icons-material/DateRange";
import GroupsIcon from "@mui/icons-material/Groups";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import EditGroup from "./EditGroup";
import GroupChatBox from "../GroupChat/GroupChatBox";
import PopupAlert from "../PopupAlert";
import { themeApp } from "../../utils/Theme";


interface IData {
	coverPhoto: string;
	createAt: string;
	title: string;
	host: string;
	gId: string;
	members: string[];
	status: string;
	details: string;
}

export default function ProCoverImage(props: IData) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const [groupId, setGroupId] = useState("");
	const [openGroupChat, setOpenGroupChat] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleOpenGroupChat = (id: string) => {
		setOpenGroupChat(true);
		setGroupId(id);
	};
	const handleCloseGroupChat = () => setOpenGroupChat(false);

	const handleDelete = () => {
		const postRef = doc(dbFireStore, "groups", props.gId);
		getDoc(postRef)
			.then((docSnap) => {
				if (docSnap.exists() && docSnap.data().hostId === userInfo.uid) {
					deleteDoc(postRef)
						.then(() => {
							navigate("/groups");
							PopupAlert("Group deleted successfully", "success");
						})
						.catch((error) => {
							console.error("Error deleting Event: ", error);
						});
				} else {
					console.log("You don't have permission to delete this Event");
				}
			})
			.catch((error) => {
				console.error("Error fetching Event: ", error);
			});
	};

	return (
		<div>
			<Modal
				open={openGroupChat}
				onClose={handleCloseGroupChat}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<GroupChatBox groupId={groupId} handleClose={handleCloseGroupChat} />
				</Box>
			</Modal>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<EditGroup
						closeEdit={handleClose}
						gId={props.gId}
						groupName={props.title}
						status={props.status}
						details={props.details}
						coverPhoto={props.coverPhoto}
					/>
				</Box>
			</Modal>
			<Card sx={{ maxWidth: "100%" }}>
				<CardMedia
					sx={{ height: 300 }}
					image={props.coverPhoto}
					title="green iguana"
				/>
			</Card>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					marginTop: "-50px",
				}}
			>
				<Card
					sx={{
						width: "95%",
						backgroundColor: "white",
						display: "flex",
						borderRadius: "10px",
						[themeApp.breakpoints.down("md")]: {
							background:
								"linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1))",
							width: "100%",
						},
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							[themeApp.breakpoints.down("lg")]: {
								textAlign: "center",
							},
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%",
								[themeApp.breakpoints.down("md")]: {
									flexDirection: "column",
									textAlign: "center"
								},
							}}
						>
							<Box
								sx={{
									mt: 1,
									ml: 1,
									display: "flex",
									justifyContent: "flex-start",
									fontSize: "25px",
									[themeApp.breakpoints.down("md")]: {
										justifyContent: "center",
										color: "white",
										textShadow: "5px 5px 5px black",
									},
								}}
							>
								{props.title}
							</Box>
							<Box
								sx={{
									display: "flex",
									gap: 0.5,
									m: 1,
									alignItems: "center"
								}}
							>
								<Button
									onClick={() => handleOpenGroupChat(props.gId)}
									sx={{
										fontSize: "16px",
										backgroundColor: "#8E51E2",
										color: "white",
										"&:hover": {
											color: "black",
											backgroundColor: "#E9E8E8",
										},
									}}
									size="small"
									startIcon={<MessageIcon sx={{ width: "16px" }} />}
								>
									Chatting
								</Button>
								{userInfo.uid === props.host && (
									<>
										<Button
											sx={{
												fontSize: "16px",
												backgroundColor: "#8E51E2",
												color: "white",
												"&:hover": {
													color: "black",
													backgroundColor: "#E9E8E8",
												},
											}}
											size="small"
											startIcon={
												<BorderColorOutlinedIcon sx={{ width: "16px" }} />
											}
											onClick={handleOpen}
										>
											Edit
										</Button>

										<Button
											onClick={handleDelete}
											sx={{
												fontSize: "16px",
												mr: 1,
												backgroundColor: "#8E51E2",
												color: "white",
												"&:hover": {
													color: "black",
													backgroundColor: "#E9E8E8",
												},
											}}
											size="small"
											startIcon={
												<DeleteOutlineOutlinedIcon sx={{ width: "16px" }} />
											}
										>
											Delete
										</Button>
									</>
								)}
							</Box>
						</Box>
						<Divider light sx={{ mb: 1 }} />
						<Box sx={{
							display: "flex", justifyContent: "space-between", [themeApp.breakpoints.down("md")]: {
								flexWrap: "wrap",
								justifyContent: "center",
							},
						}}>
							<Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
								<DateRangeIcon />
								<div>Create date: {props.createAt}</div>
							</Box>
							<Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
								<GroupsIcon />
								<div>
									{props.members.length} members | {props.status}
								</div>
							</Box>
						</Box>
					</Box>
				</Card>
			</Box>
		</div >
	);
}
