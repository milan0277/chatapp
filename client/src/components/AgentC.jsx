import React from 'react'
import { Toaster } from 'react-hot-toast'
import Footer from '../pages/Footer'
import { Outlet,useLocation } from 'react-router-dom'
import Navbar from '../pages/Navbar'
import Sidebar from '../pages/Sidebar'
import Profile from '../pages/Profile'

const AgentC = () => {
  const location = useLocation()
  

  return (
    <div className="wrapper">
{/* Navbar */}
      <Navbar />
{/* Sidebar */}
      <Sidebar/>

      <div className="content-wrapper">
      
        <div className="content-header">
          <div className="container-fluid">
           
          </div>
        </div>

{/* Main content */}
        <div className="content">
          <div className="container-fluid">
          
              
                {/* <AgentFileTable /> */}
                {location?.pathname==='/agent' && <Profile/>}
                <Outlet/>

          </div>
         
        </div>
     
      </div>

      <aside className="control-sidebar control-sidebar-dark"></aside>
{/* footer */}
      <Footer />

      <Toaster />
    </div>

  )
}

export default AgentC