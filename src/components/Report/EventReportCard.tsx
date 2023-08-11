import * as React from 'react';
import { Box, Button, TextField } from "@mui/material";
import { styleBox } from "../../utils/styleBox";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	doc,
	arrayUnion,
	updateDoc
} from "firebase/firestore";
import PopupAlert from '../PopupAlert';
import { EventReport } from '../../interface/Event';

interface IFunction {
	handleCloseReport: () => void;
}
interface IData {
	eventId: string;
}

export default function EventReportCard(props: IFunction & IData) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const initialEventState = {
		reportBy: "",
		eventId: "",
		reason: "",
		createAt: "",
	};
	const [reportEvent, setReportEvent] = React.useState<EventReport>(initialEventState);
	const clearState = () => {
		setReportEvent({ ...initialEventState });
	};
	const handleChangeReport = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setReportEvent((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const submitPostReport = () => {
		const eventCollection = collection(dbFireStore, "events");
		const newReason = {
			reportBy: userInfo.uid,
			eventId: props.eventId,
			reason: reportEvent.reason,
			createAt: new Date().toLocaleString(),
		};
		const postRef = doc(eventCollection, props.eventId);
		updateDoc(postRef, {
			reportEvent: arrayUnion(newReason),
		})
			.then(() => {
				clearState();
				PopupAlert("This event has been successfully reported", "success");
				props.handleCloseReport();
			})
			.catch((error) => {
				console.error("Error adding comment: ", error);
			});
	};

	return (
		<Box sx={styleBox}>
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
				value={reportEvent.reason}
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
