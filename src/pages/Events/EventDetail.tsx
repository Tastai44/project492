import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";
import DetailCard from "../../components/Events/DetailCard";
import LeftSideContainer from "../../components/Events/LeftSideContainer";
import CoverPhoto from "../../components/Events/CoverPhoto";
import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where, onSnapshot } from "firebase/firestore";
import { EventPost } from "../../interface/Event";
import ShareCard from "../../components/MContainer/ShareCard";
import { User } from "../../interface/User";
import { themeApp } from "../../utils/Theme";
import InterestedContainer from "../../components/Events/InterestedContainer";

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

export default function EventDetail() {
	const { eventId } = useParams();
	const [openShare, setOpenShare] = useState(false);
	const handleOpenShare = () => setOpenShare(true);
	const handleCloseShare = () => setOpenShare(false);
	const [data, setData] = useState<EventPost[]>([]);
	useEffect(() => {
		const fetchData = query(
			collection(dbFireStore, "events"),
			where("eventId", "==", eventId),
			orderBy("dateCreated", "desc")
		);
		const unsubscribe = onSnapshot(
			fetchData,
			(snapshot) => {
				const queriedData = snapshot.docs.map((doc) => doc.data() as EventPost);
				setData(queriedData);
			},
			(error) => {
				console.error("Error fetching data", error);
			}
		);
		return () => {
			unsubscribe();
		};

	}, [eventId]);

	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
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
		<div>
			{data.map((e) => (
				<Grid key={e.eventId} sx={{ flexGrow: 1 }} container>
					<Grid
						container
						justifyContent="space-between"
						sx={{
							pl: 5, pr: 5,
							[themeApp.breakpoints.down("lg")]: {
								pl: 0, pr: 0, top: 0
							}
						}}
						spacing={10}
					>
						<Grid item xs={12}>
							<Box sx={{ width: "100%" }}>
								<Stack>
									<Item sx={{ mb: 0 }}>
										<CoverPhoto
											coverPhoto={e.coverPhoto}
											title={e.title}
											location={e.location}
											startDate={e.startDate}
											startTime={e.startTime}
											eventId={e.eventId}
											endDate={e.endDate}
											endTime={e.endTime}
											topic={e.topic}
											ageRage={e.ageRage}
											interest={e.interest}
											owner={e.owner}
											handleOpenShare={handleOpenShare}
											details={e.details}
											status={e.status}
										/>
									</Item>
									<ShareCard
										openShare={openShare}
										handleCloseShare={handleCloseShare}
										friendList={
											inFoUser.find((user) => user.friendList)?.friendList ??
											[]
										}
										eventId={e.eventId}
									/>
									<Box sx={{
										[themeApp.breakpoints.down("md")]: {
											mt: "-20px"
										}
									}}>
										<Box sx={{ flexGrow: 1 }}>
											<Grid container spacing={2}>
												<Grid item xs={2.5}>
													<Item>
														<LeftSideContainer evenetData={data} />
													</Item>
												</Grid>
												<Grid item xs={12} md={7}>
													<Item>
														<DetailCard details={e.details} eventId={e.eventId} />
													</Item>
												</Grid>
												<Grid item xs={2.5}>
													<Item>
														<InterestedContainer
															interestedPeople={e.interest}
														/>
													</Item>
												</Grid>
											</Grid>
										</Box>
									</Box>
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</Grid>
			))}
		</div>
	);
}
