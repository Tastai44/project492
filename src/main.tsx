import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import Navigation from './components/Navigation.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Navigation />
    <Profile />
  </React.StrictMode>,
)
{/* <Home /> */}
{/* <App /> */}