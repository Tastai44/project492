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
      <Navigation />
      <Routes>
        <Route path={"/login"} element={<Login />} />

        <Route
          path={"/"}
          element={
            <>
              <ProtectedRoute>
                <HomeFeed />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/members"}
          element={
            <>
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/topics"}
          element={
            <>
              <ProtectedRoute>
                <Topics />
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
                <Blog />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/aboutMe/:userId"}
          element={
            <>
              <ProtectedRoute>
                <AboutMe />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/friends/:userId"}
          element={
            <>
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/collections/:userId"}
          element={
            <>
              <ProtectedRoute>
                <Collections />
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
                <Events />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/eventsDetail/:eventId"}
          element={
            <>
              <ProtectedRoute>
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
                <Groups />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path={"/groupDetail/:groupId"}
          element={
            <>
              <ProtectedRoute>
                <GroupDetails />
              </ProtectedRoute>
            </>
          }
        />
        {/* Groups */}
      </Routes>
    </>
  );
}

export default App;
