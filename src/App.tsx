import { useState, useEffect } from "react";
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
// import Login from "./pages/Login/Login";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Box, Stack } from "@mui/material";
import LeftSide from "./components/LeftSide";
import RightContainer from "./components/RightSide/RightContainer";

import ProCoverImage from "./components/Profile/ProCoverImage";
import ProLeftside from "./components/Profile/ProLeftside";
import { styled } from "@mui/material/styles";
import ReportContent from "./pages/ReportContent";
import { themeApp } from "./utils/Theme";
import { IconButton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import OAuthRedirect from "./pages/OauthRedirect";

export const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

function App() {

	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		function handleScroll() {
			if (window.scrollY > 100) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		}
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scrollUp = () => {
		window.scroll({
			top: -100,
			behavior: "smooth",
		});
	};
	return (
		<>
			<Box
				sx={{
					position: "fixed",
					right: "10px",
					bottom: 2,
					display: isVisible ? "block" : "none",
					zIndex: 100,
				}}
			>
				<IconButton
					onClick={scrollUp}
					sx={{
						color: "white",
						backgroundColor: "primary.main",
						"&:hover": { backgroundColor: "grey" },
					}}
				>
					<ArrowCircleUpIcon />
				</IconButton>
			</Box>

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

				<Route path={"/callback"} element={
					<Box sx={{
						ml: 5, mr: 5, [themeApp.breakpoints.down("lg")]: {
							ml: 2, mr: 2
						}
					}}>
						<OAuthRedirect />
					</Box>
				} />


				<Route
					path={"/"}
					element={
						<>
							<ProtectedRoute>
								<Navigation />
								<Box sx={{
									display: "flex", justifyContent: "center", mt: 11,
									[themeApp.breakpoints.down("lg")]: {
										mt: 8
									}
								}}>
									<Box sx={{ width: "20%", position: "fixed", left: "0" }}>
										<LeftSide />
									</Box>

									<Box sx={{
										width: "45%",
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
										justifyContent: "center",
										mt: 8
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
								<Box sx={{
									display: "flex", justifyContent: "center", mt: 11,
									[themeApp.breakpoints.down("lg")]: {
										mt: 8
									}
								}}>
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
										mt: 8
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
								<Box sx={{
									display: "flex", mt: 11, [themeApp.breakpoints.down("lg")]: {
										mt: 8
									}
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
											<Box sx={{
												[themeApp.breakpoints.down("lg")]: {
													ml: "5px",
													mr: "5px",
												}
											}}>
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
								<Box sx={{
									display: "flex", mt: 11, [themeApp.breakpoints.down("lg")]: {
										mt: 8
									}
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
											<Box sx={{
												[themeApp.breakpoints.down("lg")]: {
													ml: "5px",
													mr: "5px",
												}
											}}>
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
								<Box sx={{
									display: "flex", mt: 11, [themeApp.breakpoints.down("lg")]: {
										mt: 8
									}
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
											<Box sx={{
												[themeApp.breakpoints.down("lg")]: {
													ml: "5px",
													mr: "5px",
												}
											}}>
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
							<ProtectedRoute>
								<Navigation />
								<Box sx={{
									display: "flex", mt: 11, ml: 5, mr: 5, [themeApp.breakpoints.down("md")]: {
										justifyContent: "center",
										mt: 8
									},
								}}>
									<Events />
								</Box>
							</ProtectedRoute>
						</>
					}
				/>
				<Route
					path={"/eventsDetail/:eventId"}
					element={
						<>
							<ProtectedRoute>
								<Navigation />
								<Box sx={{
									[themeApp.breakpoints.down("lg")]: {
										mt: 7
									}
								}}>
									<EventDetail />
								</Box>

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
								<Box sx={{
									display: "flex", justifyContent: "center", mt: 11,
									[themeApp.breakpoints.down("lg")]: {
										mt: 8
									}
								}}>
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
								<Navigation />
								<Box sx={{
									[themeApp.breakpoints.down("lg")]: {
										mt: 7
									}
								}}>
									<GroupDetails />
								</Box>
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
								<Box sx={{
									display: "flex", justifyContent: "center", [themeApp.breakpoints.down("lg")]: {
										justifyContent: "center", mt: 8, mr: 1, ml: 1
									},
								}}>
									<ReportContent />

								</Box>
							</ProtectedRoute>
						</>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
