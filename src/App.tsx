import * as React from "react";
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

import { collection, query, getDocs, where } from "firebase/firestore";
import { User } from "./interface/User";
import { dbFireStore } from "./config/firebase";
import ProCoverImage from "./components/Profile/ProCoverImage";
import ProLeftside from "./components/Profile/ProLeftside";
import { styled } from "@mui/material/styles";

export const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);

  React.useEffect(() => {
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
  }, [userInfo.uid, reFresh]);

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
                  open={open}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                  inFoUser={inFoUser}
                />
                <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                      <Grid item xs={2}>
                        <Box style={{ position: "fixed" }}>
                          <LeftSide inFoUser={inFoUser} />
                        </Box>
                      </Grid>

                      <Grid item xs={7}>
                        <HomeFeed inFoUser={inFoUser} />
                      </Grid>

                      <Grid item xs={2}>
                        <Box style={{ position: "fixed" }}>
                          <RightContainer handleOpen={handleOpen} />
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
              <Navigation
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
              />
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
                        <LeftSide inFoUser={inFoUser} />
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
              <Navigation
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                        <LeftSide inFoUser={inFoUser} />
                      </div>
                    </Grid>

                    <Grid item xs={7}>
                      <Topics />
                    </Grid>

                    <Grid item xs={2}>
                      <div style={{ position: "fixed" }}>
                        <RightContainer handleOpen={handleOpen} />
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                        <ProLeftside handleRefreshData={handleRefresh} />
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
                              <Blog inFoUser={inFoUser} />
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                        <ProLeftside handleRefreshData={handleRefresh} />
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
                              <AboutMe inFoUser={inFoUser} />
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                        <ProLeftside handleRefreshData={handleRefresh} />
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                        <ProLeftside handleRefreshData={handleRefresh} />
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
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
                        <LeftSide inFoUser={inFoUser} />
                      </div>
                    </Grid>

                    <Grid item xs={7}>
                      <Groups />
                    </Grid>

                    <Grid item xs={2}>
                      <div style={{ position: "fixed" }}>
                        <RightContainer handleOpen={handleOpen} />
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
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                inFoUser={inFoUser}
              />
              <GroupDetails inFoUser={inFoUser}/>
              {/* </ProtectedRoute> */}
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
