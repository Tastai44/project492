import { Routes, Route } from "react-router-dom";
import "./App.css";
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
				<Route path={"/login"} element={
					<Box sx={{
						ml: 5, mr: 5, [themeApp.breakpoints.down("lg")]: {
							ml: 2, mr: 2
						}
					}}>
						<Login />
					</Box>
				} />

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
							<ProtectedRoute>
								<Navigation />
								<Box sx={{
									display: "flex", mt: 11, ml: 5, mr: 5, [themeApp.breakpoints.down("md")]: {
										justifyContent: "center"
									},
								}}>
									<Members />
								</Box>

							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/topics"}
					element={
						<>
							<ProtectedRoute>
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
							</ProtectedRoute>
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
								<Box sx={{
									display: "flex", mt: 11, [themeApp.breakpoints.down("md")]: {
										mt: 7
									},
								}}>
									<Box sx={{ width: "20%", position: "fixed", left: "0", ml: 5 }}>
										<ProLeftside />
									</Box>

									<Box sx={{
										width: "80%",
										ml: "20%",
										mr: 5,
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "2px",
											mr: "2px",
										}
									}}>
										<Stack>
											<Box sx={{ mb: 2 }}>
												<ProCoverImage />
											</Box>
											<Box>
												<Blog />
											</Box>
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
										width: "80%",
										ml: "20%",
										mr: 5,
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "2px",
											mr: "2px",
										}
									}}>
										<Stack>
											<Box sx={{ mb: 2 }}>
												<ProCoverImage />
											</Box>
											<Box>
												<AboutMe />
											</Box>
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
										width: "80%",
										ml: "20%",
										mr: 5,
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "2px",
											mr: "2px",
										}
									}}>
										<Stack>
											<Box sx={{ mb: 2 }}>
												<ProCoverImage />
											</Box>
											<Box>
												<Friends />
											</Box>
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
										width: "80%",
										ml: "20%",
										mr: 5,
										[themeApp.breakpoints.down("lg")]: {
											width: "100%",
											ml: "2px",
											mr: "2px",
										}
									}}>
										<Stack>
											<Box sx={{ mb: 2 }}>
												<ProCoverImage />
											</Box>
											<Box>
												<Collections />
											</Box>
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
							<ProtectedRoute>
								<Navigation />
								<EventDetail />
							</ProtectedRoute>
						</>
					}
				/>
				{/* Event */}

				{/* Groups */}
				<Route
					path={"/groups"}
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
										<Groups />
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
					path={"/groupDetail/:groupId"}
					element={
						<>
							<ProtectedRoute>
								<Navigation
								/>
								<GroupDetails />
							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/report"}
					element={
						<>
							<ProtectedRoute>
								<Navigation
								/>
								{/* <Members /> */}
								<Grid sx={{ flexGrow: 1 }} container>
									<Grid item xs={12}>
										<ReportContent />
									</Grid>
								</Grid>
							</ProtectedRoute>
						</>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
