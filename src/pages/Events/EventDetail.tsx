import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { styled, Box, Grid, Stack } from "@mui/material";
import DetailCard from "../../components/Events/DetailCard";
import LeftSideContainer from "../../components/Events/LeftSideContainer";
import CoverPhoto from "../../components/Events/CoverPhoto";
import { dbFireStore, storage } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where, onSnapshot } from "firebase/firestore";
import { EventPost } from "../../interface/Event";
import ShareCard from "../../components/MContainer/ShareCard";
import { User } from "../../interface/User";
import { themeApp } from "../../utils/Theme";
import InterestedContainer from "../../components/Events/InterestedContainer";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

export default function EventDetail() {
	const { eventId } = useParams();
	const [openShare, setOpenShare] = useState(false);
	const [data, setData] = useState<EventPost[]>([]);
	const [inFoUser, setInFoUser] = useState<User[]>([]);
	const userInfo = JSON.parse(localStorage.getItem("user") || "null");
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [reFreshImage, setReFreshImage] = useState(0);

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

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const listRef: StorageReference = ref(storage, '/Images');
				const res = await listAll(listRef);
				const urls = await Promise.all(
					res.items.map(async (itemRef) => {
						const imageUrl = await getDownloadURL(itemRef);
						return imageUrl;
					})
				);
				setImageUrls(urls);
			} catch (error) {
				console.error('Error fetching images:', error);
			}
		};
		fetchImages();
	}, [reFreshImage]);

	const handleOpenShare = () => setOpenShare(true);
	const handleCloseShare = () => setOpenShare(false);

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
											imageUrls={imageUrls}
											handleReFreshImage={() => setReFreshImage(pre => pre + 1)}
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
										imageUrls={imageUrls}
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
														<LeftSideContainer
															evenetData={data}
															imageUrls={imageUrls}
														/>
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
