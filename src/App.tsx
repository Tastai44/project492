
import {Routes, Route} from "react-router-dom"

import './App.css'

import Navigation from "./components/Navigation"
import HomeFeed from "./pages/HomeFeed"
import Members from "./pages/Members"
import Topics from "./pages/Topics"
import Groups from "./pages/Groups"
import Events from "./pages/Events"

function App() {

  return (
    <>
      {/* <BrowserRouter> */}
      <Navigation />
        <Routes>
          <Route  path={"/"} element={<HomeFeed />} />
          <Route path={"/members"} element={<Members />} />
          <Route path={"/topics"} element={<Topics />} />
          <Route path={"/groups"} element={<Groups />} />
          <Route path={"/events"} element={<Events />} />
        </Routes>
    
    {/* </BrowserRouter> */}
    </>
  )
}

export default App
