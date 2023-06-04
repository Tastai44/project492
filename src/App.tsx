
import {Routes, Route} from "react-router-dom"
import './App.css'
import Navigation from "./components/Navigation"
import HomeFeed from "./pages/HomeFeed"
import Members from "./pages/Members"
import Topics from "./pages/Topics"
import Groups from "./pages/Group/Groups"
import Events from "./pages/Events/Events"
import Blog from "./pages/Profile/Blog"
import AboutMe from "./pages/Profile/AboutMe"
import Friends from "./pages/Profile/Friends"
import Collections from "./pages/Profile/Collections"
import EventDetail from "./pages/Events/EventDetail"
import GroupDetails from "./pages/Group/GroupDetails"

function App() {

  return (
    <>
      <Navigation />
        <Routes>
          <Route  path={"/"} element={<HomeFeed />} />
          <Route path={"/members"} element={<Members />} />
          <Route path={"/topics"} element={<Topics />} />
          
          <Route path={"/profileBlog/:userId"} element={<Blog />} />
          <Route path={"/aboutMe/:userId"} element={<AboutMe />} />
          <Route path={"/friends/:userId"} element={<Friends />} />
          <Route path={"/collections/:userId"} element={<Collections />} />

          <Route path={"/events"} element={<Events />} />
          <Route path={"/eventsDetail/:eventId"} element={<EventDetail />} />
          
          <Route path={"/groups"} element={<Groups />} />
          <Route path={"/groupDetail/:groupId"} element={<GroupDetails />} />

        </Routes>
    </>
  )
}

export default App
