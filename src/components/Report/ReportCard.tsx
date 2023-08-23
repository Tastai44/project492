import { useState, ChangeEvent } from "react";
import { Box, Button, TextField } from "@mui/material";
import { styleBoxReport } from "../../utils/styleBox";
import { PostReport } from '../../interface/PostContent';
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	doc,
	arrayUnion,
	updateDoc
} from "firebase/firestore";
import PopupAlert from '../PopupAlert';

interface IFunction {
	handleCloseReport: () => void;
}
interface IData {
	postId: string;
}

export default function ReportCard(props: IFunction & IData) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const initialPostState = {
		uid: "",
		postId: "",
		reason: "",
		createAt: "",
	};
	const [report, setReport] = useState<PostReport>(initialPostState);
	const clearState = () => {
		setReport({ ...initialPostState });
	};
	const handleChangeReport = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setReport((prevComment) => ({
			...prevComment,
			[name]: value,
		}));
	};

	const submitPostReport = () => {
		const postsCollection = collection(dbFireStore, "posts");
		const newComment = {
			uid: userInfo.uid,
			postId: props.postId,
			reason: report.reason,
			createAt: new Date().toLocaleString(),
		};
		const postRef = doc(postsCollection, props.postId);
		updateDoc(postRef, {
			reportPost: arrayUnion(newComment),
		})
			.then(() => {
				clearState();
				PopupAlert("This post has been successfully reported", "success");
				props.handleCloseReport();
			})
			.catch((error) => {
				console.error("Error adding comment: ", error);
			});
	};

	return (
		<Box sx={styleBoxReport}>
			<Box sx={{ display: "flex", mb: 1 }}>
				<Box
					id="modal-modal-title"
					sx={{ fontSize: "25px", fontWeight: "500", color: "black" }}
				>
					Report
				</Box>
			</Box>
			<TextField
				name='reason'
				id="outlined-basic"
				label="Reasons"
				variant="outlined"
				multiline
				maxRows={3}
				sx={{ width: "100%" }}
				value={report.reason}
				onChange={handleChangeReport}
			/>
			<Box
				sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
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
					onClick={props.handleCloseReport}
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
					onClick={submitPostReport}
				>
					Send
				</Button>
			</Box>
		</Box>
	);
}
