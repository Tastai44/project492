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
                <Navigation />
                <HomeFeed />
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
              <Members />
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
              <Topics />
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
              <Navigation />
              <Blog />
              {/* </ProtectedRoute> */}
            </>
          }
        />
        <Route
          path={"/aboutMe/:userId"}
          element={
            <>
              {/* <ProtectedRoute> */}
              <Navigation />
              <AboutMe />
              {/* </ProtectedRoute> */}
            </>
          }
        />
        <Route
          path={"/friends/:userId"}
          element={
            <>
              {/* <ProtectedRoute> */}
              <Navigation />
              <Friends />
              {/* </ProtectedRoute> */}
            </>
          }
        />
        <Route
          path={"/collections/:userId"}
          element={
            <>
              {/* <ProtectedRoute> */}
              <Navigation />
              <Collections />
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
              <Navigation />
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
              <Navigation />
              <Groups />
              {/* </ProtectedRoute> */}
            </>
          }
        />
        <Route
          path={"/groupDetail/:groupId"}
          element={
            <>
              {/* <ProtectedRoute> */}
              <Navigation />
              <GroupDetails />
              {/* </ProtectedRoute> */}
            </>
          }
        />
        {/* Groups */}
      </Routes>
    </>
  );
}

export default App;
