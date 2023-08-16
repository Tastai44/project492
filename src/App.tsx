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
								<Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
									<Grid item xs={12}>
										<Grid container justifyContent="space-between">
											<Grid item xs={2}>
												<Box style={{ position: "fixed" }}>
													<LeftSide />
												</Box>
											</Grid>

											<Grid item xs={7}>
												<HomeFeed />
											</Grid>

											<Grid item xs={2}>
												<Box style={{ position: "fixed" }}>
													<RightContainer />
												</Box>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
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
							{/* <Members /> */}
							<Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
									>
										<Grid item xs={2}>
											<div style={{ position: "fixed" }}>
												<LeftSide />
											</div>
										</Grid>
										<Members />
									</Grid>
								</Grid>
							</Grid>
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
							<Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
									>
										<Grid item xs={2}>
											<div style={{ position: "fixed" }}>
												<LeftSide />
											</div>
										</Grid>

										<Grid item xs={7}>
											<Topics />
										</Grid>

										<Grid item xs={2}>
											<div style={{ position: "fixed" }}>
												<RightContainer />
											</div>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				{/* Profile */}
				<Route
					path={"/profileBlog/:userId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>

							<Grid sx={{ flexGrow: 1 }} container marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
										spacing={10}
									>
										<Grid item xs={2}>
											<Item sx={{ backgroundColor: "#EEECEF" }}>
												<ProLeftside />
											</Item>
										</Grid>
										<Grid item xs={10}>
											<Item>
												<Box sx={{ width: "100%" }}>
													<Stack spacing={2}>
														<Item>
															<ProCoverImage />
														</Item>
														<Item>
															<Blog />
														</Item>
													</Stack>
												</Box>
											</Item>
										</Grid>
									</Grid>
								</Grid>
							</Grid>

							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/aboutMe/:userId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
							<Grid sx={{ flexGrow: 1 }} container marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
										spacing={10}
									>
										<Grid item xs={2}>
											<Item sx={{ backgroundColor: "#EEECEF" }}>
												<ProLeftside />
											</Item>
										</Grid>

										<Grid item xs={10}>
											<Item>
												<Box sx={{ width: "100%" }}>
													<Stack spacing={2}>
														<Item>
															<ProCoverImage />
														</Item>
														<Item>
															<AboutMe />
														</Item>
													</Stack>
												</Box>
											</Item>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/friends/:userId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
							<Grid sx={{ flexGrow: 1 }} container marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
										spacing={10}
									>
										<Grid item xs={2}>
											<Item sx={{ backgroundColor: "#EEECEF" }}>
												<ProLeftside />
											</Item>
										</Grid>

										<Grid item xs={10}>
											<Item>
												<Box sx={{ width: "100%" }}>
													<Stack>
														<Item>
															<ProCoverImage />
														</Item>
														<Item>
															<Friends />
														</Item>
													</Stack>
												</Box>
											</Item>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/collections/:userId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
							<Grid sx={{ flexGrow: 1 }} container marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
										spacing={10}
									>
										<Grid item xs={2}>
											<Item sx={{ backgroundColor: "#EEECEF" }}>
												<ProLeftside />
											</Item>
										</Grid>

										<Grid item xs={10}>
											<Item>
												<Box sx={{ width: "100%" }}>
													<Stack>
														<Item>
															<ProCoverImage />
														</Item>
														<Item>
															<Collections />
														</Item>
													</Stack>
												</Box>
											</Item>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							{/* </ProtectedRoute> */}
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
							<Navigation
							/>
							<Events />
							{/* </ProtectedRoute> */}
						</>
					}
				/>
				<Route
					path={"/eventsDetail/:eventId"}
					element={
						<>
							{/* <ProtectedRoute> */}
							<Navigation
							/>
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
							<Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
								<Grid item xs={12}>
									<Grid
										container
										justifyContent="space-between"
										paddingLeft={5}
										paddingRight={5}
									>
										<Grid item xs={2}>
											<div style={{ position: "fixed" }}>
												<LeftSide />
											</div>
										</Grid>

										<Grid item xs={7}>
											<Groups />
										</Grid>

										<Grid item xs={2}>
											<div style={{ position: "fixed" }}>
												<RightContainer />
											</div>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
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
