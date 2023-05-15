
import {Routes, Route} from "react-router-dom"
import './App.css'
import Navigation from "./components/Navigation"
import HomeFeed from "./pages/HomeFeed"
import Members from "./pages/Members"
import Topics from "./pages/Topics"
import Groups from "./pages/Groups"
import Events from "./pages/Events"
import Blog from "./pages/Profile/Blog"
import AboutMe from "./pages/Profile/AboutMe"

function App() {

  return (
    <>
      <Navigation />
        <Routes>
          <Route  path={"/"} element={<HomeFeed />} />
          <Route path={"/members"} element={<Members />} />
          <Route path={"/topics"} element={<Topics />} />
          <Route path={"/groups"} element={<Groups />} />
          <Route path={"/events"} element={<Events />} />

          <Route path={"/profileBlog/:userId"} element={<Blog />} />
          <Route path={"/aboutMe/:userId"} element={<AboutMe />} />
        </Routes>
    </>
  )
}

export default App
