
import {Routes, Route} from "react-router-dom"

import './App.css'

import Navigation from "./components/Navigation"
import HomeFeed from "./pages/HomeFeed"
import Members from "./pages/Members"

function App() {

  return (
    <>
      {/* <BrowserRouter> */}
      <Navigation />
        <Routes>
          <Route  path={"/"} element={<HomeFeed />} />
          <Route path={"/members"} element={<Members />} />
        </Routes>
    
    {/* </BrowserRouter> */}
    </>
  )
}

export default App
