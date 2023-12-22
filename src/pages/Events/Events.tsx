import { useState, ChangeEvent, useEffect } from "react";
import { Button, Modal, Typography, Box, Stack, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, FormControlLabel, FormGroup } from "@mui/material";
import EventContainer from "../../components/Events/EventContainer";
import AddEvent from "../../components/Events/AddEvent";
import SearchBar from "../../helper/SearchBar";
import { themeApp } from "../../utils/Theme";
import { Item } from "../../App";
import AddIcon from '@mui/icons-material/Add';
import { EventPost } from "../../interface/Event";
import { dbFireStore } from "../../config/firebase";
import {
	collection,
	query,
	orderBy,
	onSnapshot,
	getDocs,
} from "firebase/firestore";
import Loading from "../../components/Loading";

export default function Events() {
	const [open, setOpen] = useState(false);
	const [searchValue, setValue] = useState("");
	const [dateType, setDateType] = useState("All");
	const [refresh, setRefresh] = useState(0);
	const [interested, setInterested] = useState(false);
	const [eventData, setEventData] = useState<EventPost[]>([]);
	const [openLoading, setOpenLoading] = useState(false);

	useEffect(() => {
		setOpenLoading(true);
		const fetchData = query(
			collection(dbFireStore, "events"),
			orderBy("startDate", "desc")
		);
		const unsubscribe = onSnapshot(
			fetchData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as EventPost);
				setEventData(queriedData);
				setOpenLoading(false);
			},
			(error) => {
				console.error("Error fetching data", error);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [refresh]);

	const fomateDate = (date: string) => {
		const dateComponents = date.split('/');
		const dateStr = `${dateComponents[2]}-${dateComponents[0]}-${dateComponents[1]}`;
		const parts = dateStr.split("-");
		const year = parts[0];
		const month = parts[1];
		const day = parts[2];
		const formattedDate = `${year}-${month}-${day.padStart(2, '0')}`;
		return formattedDate;
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};

	const handleDateType = (e: SelectChangeEvent) => {
		setDateType(e.target.value as string);
	};

	const handleRefresh = () => {
		setRefresh((pre) => pre + 1);
	};

	const handleDaily = () => {
		const today = new Date().toLocaleDateString("en-US");
		const formattedDate = fomateDate(today);
		const todayEvent = eventData.filter((event) => event.startDate >= formattedDate && event.endDate <= formattedDate);
		setEventData(todayEvent);
	};

	const handleWeekly = () => {
		const today = new Date();
		const firstDayOfWeek = new Date(today);
		const dayOfWeek = today.getDay();

		firstDayOfWeek.setDate(
			today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
		);

		const lastDayOfWeek = new Date(firstDayOfWeek);
		lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

		const startDate = firstDayOfWeek.toLocaleDateString("en-US");
		const endDate = lastDayOfWeek.toLocaleDateString("en-US");

		const fetchWeeklyData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "events")
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as EventPost);
				setEventData(queriedData.filter((event) => new Date(event.startDate ?? "") >= new Date(startDate) && new Date(event.endDate ?? "") <= new Date(endDate)));
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchWeeklyData();
	};

	const handleMonthly = () => {
		const today = new Date();
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const lastDayOfMonth = new Date(
			today.getFullYear(),
			today.getMonth() + 1,
			0
		);
		const startOfMonth = firstDayOfMonth.toLocaleDateString("en-US");
		const endOfMonth = lastDayOfMonth.toLocaleDateString("en-US");

		const fetchMonthData = async () => {
			try {
				const q = query(
					collection(dbFireStore, "events")
				);
				const querySnapshot = await getDocs(q);
				const queriedData = querySnapshot.docs.map((doc) => doc.data() as EventPost);
				setEventData(queriedData.filter((event) => new Date(event.startDate ?? "") >= new Date(startOfMonth) && new Date(event.endDate ?? "") <= new Date(endOfMonth)));
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchMonthData();

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
					<AddEvent
						closeAdd={handleClose}
					/>
				</Box>
			</Modal>
			<Box sx={{
				width: "100%"
			}}>
				<Stack>
					<Item
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center", [themeApp.breakpoints.down("md")]: {
								flexDirection: "column"
							},
						}}
					>
						<Typography
							sx={{ fontSize: "30px", color: "#920EFA", fontWeight: 500 }}
						>
							CMU Events
						</Typography>

					</Item>
					<Item sx={{ ml: -1 }}>
						<Box sx={{
							display: "flex", alignItems: "center", [themeApp.breakpoints.down("md")]: {
								flexDirection: "column"
							}, justifyContent: "space-between"
						}}>
							<Box sx={{
								display: "flex", alignContent: "center", alignItems: "center", gap: 2, [themeApp.breakpoints.down("md")]: {
									flexDirection: "column"
								},
							}}>
								<SearchBar
									searchValue={searchValue}
									handleSearch={handleSearch}
									backgroupColor={'#FFFFFF'}
								/>

								<FormControl fullWidth sx={{ width: "200px" }}>
									<InputLabel id="demo-simple-select-label">D/W/M</InputLabel>
									<Select
										size="small"
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={dateType}
										label="D/W/M"
										onChange={handleDateType}
										sx={{
											'& fieldset': {
												borderRadius: '20px',
											},
										}}
									>
										<MenuItem onClick={handleRefresh} value={"All"}>
											All
										</MenuItem>
										<MenuItem onClick={handleDaily} value={"Daily"}>
											Daily
										</MenuItem>
										<MenuItem onClick={handleWeekly} value={"Weekly"}>
											Weekly
										</MenuItem>
										<MenuItem onClick={handleMonthly} value={"Monthly"}>
											Monthly
										</MenuItem>
									</Select>
								</FormControl>

								<FormGroup>
									<FormControlLabel control={<Switch value={interested} onChange={() => setInterested(!interested)} />} label="Interested" />
								</FormGroup>
							</Box>

							<Button
								sx={{
									fontSize: "16px",
									"&:hover": { backgroundColor: "white", color: "black" },
									borderRadius: "20px",
									backgroundColor: "#A020F0",
									padding: "5px",
									color: "#fff",
								}}
								startIcon={<AddIcon />}
								onClick={handleOpen}
							>
								Create Events
							</Button>
						</Box>
					</Item>

					<Box sx={{
						display: "flex",
						width: "100%",
						[themeApp.breakpoints.down("md")]: {
							justifyContent: "center",
						},
					}}>
						<EventContainer
							searchValue={searchValue}
							refresh={refresh}
							interested={interested}
							eventData={eventData}
						/>
					</Box>
				</Stack >
			</Box >
		</>
	);
}
