
import { BrowserRouter, Routes, Route} from "react-router-dom"

import './App.css'

import Navigation from "./components/Navigation"
import HomeFeed from "./pages/HomeFeed"

function App() {

  return (
    <>
      <BrowserRouter>
      <Navigation />
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/profile:userId" element={<HomeFeed />} />


          {/* <Route path='/back' /> */}
        </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
