import { useState } from "react";
import { Avatar, TextField, Divider, Box, Button, Modal } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { User } from "../../interface/User";
import CreateGroupPost from "./CreateGroupPost";

interface IData {
	inFoUser: User[];
	groupName: string;
	groupId: string;
	groupStatus: string;
}

export default function PostGroupForm(props: IData) {
	const [openCreatePost, setOpenCreatePost] = useState(false);

	const handletOpenCratePost = () => setOpenCreatePost(true);
	const handleCloseCratePost = () => setOpenCreatePost(false);

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<Modal
				open={openCreatePost}
				onClose={handleCloseCratePost}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<CreateGroupPost
						handleCloseCratePost={handleCloseCratePost}
						groupName={props.groupName}
						groupId={props.groupId}
						groupStatus={props.groupStatus}
					/>
				</Box>
			</Modal>
			{props.inFoUser.map((u) => (
				<div
					key={u.uid}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-evenly",
						marginBottom: 10,
						borderRadius: "10px",
					}}
				>
					<Avatar
						alt="User"
						src={u.profilePhoto}
						sx={{ width: "40px", height: "40px", mr: 1 }}
					/>
					<div style={{ width: "98%" }}>
						<TextField
							id="outlined-basic"
							label="What is in your mind?"
							variant="outlined"
							maxRows={4}
							sx={{ width: "99%" }}
							onClick={handletOpenCratePost}
							size="small"
						/>
					</div>
				</div>
			))}
			<Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-evenly",
					fontSize: "16px",
				}}
			>
				<Button
					onClick={handletOpenCratePost}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "5px",
						color: "grey",
					}}
				>
					<InsertPhotoIcon sx={{ color: "green" }} /> Photo
				</Button>
				<Button
					onClick={handletOpenCratePost}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "5px",
						color: "grey",
					}}
				>
					<LocationOnIcon color="error" /> Location
				</Button>
				<Button
					onClick={handletOpenCratePost}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "5px",
						color: "grey",
					}}
				>
					<EmojiEmotionsIcon sx={{ color: "#FCE205" }} /> Feeling
				</Button>
			</Box>
		</div>
	);
}
