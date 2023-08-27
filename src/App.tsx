import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomeFeed from "./pages/HomeFeed";
import Members from "./pages/Members";
import Topics from "./pages/Topics";
import Groups from "./pages/Group/Groups";
import Events from "./pages/Events/Events";
import Blog from "./pages/Profile/Blog";
import AboutMe from "./pages/Profile/AboutMe";
import Friends from "./pages/Profile/Friends";
import Collections from "./pages/Profile/Collections";
import EventDetail from "./pages/Events/EventDetail";
import GroupDetails from "./pages/Group/GroupDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Box, Grid, Stack } from "@mui/material";
import LeftSide from "./components/LeftSide";
import RightContainer from "./components/RightSide/RightContainer";

import ProCoverImage from "./components/Profile/ProCoverImage";
import ProLeftside from "./components/Profile/ProLeftside";
import { styled } from "@mui/material/styles";
import ReportContent from "./pages/ReportContent";
import { themeApp } from "./utils/Theme";


export const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

function App() {

	return (
		<>
			<Routes>
				<Route path={"/login"} element={<Login />} />

				<Route
					path={"/"}
					element={
						<>
							<ProtectedRoute>
								<Navigation
								/>
								<Box sx={{ display: "flex", justifyContent: "center", mt: 11 }}>
									<Box sx={{ width: "20%", position: "fixed", left: "0" }}>
										<LeftSide />
									</Box>

									<Box sx={{
										width: "55%",
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
										}
									}}>
										<HomeFeed />
									</Box>

									<Box sx={{ width: "20%", position: "fixed", right: "0" }}>
										<RightContainer />
									</Box>
								</Box>
							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/members"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation />
							<Box sx={{
								display: "flex", mt: 11, ml: 5, mr: 5, [themeApp.breakpoints.down("md")]: {
									justifyContent: "center"
								},
							}}>
								<Members />
							</Box>

							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/topics"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation />
							<Box sx={{ display: "flex", justifyContent: "center", mt: 11 }}>
								<Box sx={{ width: "20%", position: "fixed", left: "0" }}>
									<LeftSide />
								</Box>

								<Box sx={{
									width: "55%",
									[themeApp.breakpoints.down("lg")]: {
										width: "100%",
									}
								}}>
									<Topics />
								</Box>

								<Box sx={{ width: "20%", position: "fixed", right: "0" }}>
									<RightContainer />
								</Box>
							</Box>
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				{/* Profile */}
				<Route
					path={"/profileBlog/:userId"}
					element={
						<>
							<ProtectedRoute>
								<Navigation />
								<Box sx={{ display: "flex", mt: 11 }}>
									<Box sx={{ width: "20%", position: "fixed", left: "0", ml: 5 }}>
										<ProLeftside />
									</Box>

									<Box sx={{
										width: "75%",
										ml: "20%",
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "0px",
										}
									}}>
										<Stack spacing={2}>
											<Item>
												<ProCoverImage />
											</Item>
											<Item>
												<Blog />
											</Item>
										</Stack>
									</Box>
								</Box>
							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/aboutMe/:userId"}
					element={
						<>
							<ProtectedRoute>
								<Navigation />
								<Box sx={{ display: "flex", mt: 11 }}>
									<Box sx={{ width: "20%", position: "fixed", left: "0", ml: 5 }}>
										<ProLeftside />
									</Box>

									<Box sx={{
										width: "75%",
										ml: "20%",
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "0px",
										}
									}}>
										<Stack spacing={2}>
											<Item>
												<ProCoverImage />
											</Item>
											<Item>
												<AboutMe />
											</Item>
										</Stack>
									</Box>
								</Box>
							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/friends/:userId"}
					element={
						<>
							<ProtectedRoute>
								<Navigation />
								<Box sx={{ display: "flex", mt: 11 }}>
									<Box sx={{ width: "20%", position: "fixed", left: "0", ml: 5 }}>
										<ProLeftside />
									</Box>

									<Box sx={{
										width: "75%",
										ml: "20%",
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "0px",
										}
									}}>
										<Stack spacing={2}>
											<Item>
												<ProCoverImage />
											</Item>
											<Item>
												<Friends />
											</Item>
										</Stack>
									</Box>
								</Box>
							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/collections/:userId"}
					element={
						<>
							<ProtectedRoute>
								<Navigation />
								<Box sx={{ display: "flex", mt: 11 }}>
									<Box sx={{ width: "20%", position: "fixed", left: "0", ml: 5 }}>
										<ProLeftside />
									</Box>

									<Box sx={{
										width: "75%",
										ml: "20%",
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "0px",
										}
									}}>
										<Stack spacing={2}>
											<Item>
												<ProCoverImage />
											</Item>
											<Item>
												<Collections />
											</Item>
										</Stack>
									</Box>
								</Box>
							</ProtectedRoute>
						</>
					}
				/>
				{/* Profile */}

				{/* Event */}
				<Route
					path={"/events"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation />
							<Box sx={{
								display: "flex", mt: 11, ml: 5, mr: 5, [themeApp.breakpoints.down("md")]: {
									justifyContent: "center"
								},
							}}>
								<Events />
							</Box>
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/eventsDetail/:eventId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation />
							<EventDetail />
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				{/* Event */}

				{/* Groups */}
				<Route
					path={"/groups"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
							<Box sx={{ display: "flex", justifyContent: "center", mt: 11 }}>
								<Box sx={{ width: "20%", position: "fixed", left: "0" }}>
									<LeftSide />
								</Box>

								<Box sx={{
									width: "55%",
									[themeApp.breakpoints.down("lg")]: {
										width: "100%",
									}
								}}>
									<Groups />
								</Box>

								<Box sx={{ width: "20%", position: "fixed", right: "0" }}>
									<RightContainer />
								</Box>
							</Box>

							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/groupDetail/:groupId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
							<GroupDetails />
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/report"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
							{/* <Members /> */}
							<Grid sx={{ flexGrow: 1 }} container>
								<Grid item xs={12}>
									<ReportContent />
								</Grid>
							</Grid>
							{/* </ProtectedRoute> */}
						</>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
