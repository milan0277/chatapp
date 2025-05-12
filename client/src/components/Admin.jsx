import React from 'react'
import "../pages/home.css"
import Sidebar from '../pages/Sidebar';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import { Outlet } from 'react-router-dom'


const Admin = () => {

    return (
        <div className="wrapper">
{/* Navbar */}
            <Navbar />
{/* Sidebar */}    
            <Sidebar />
{/* MainContent */}     
            <div className="content-wrapper">
            
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row ">
                            <div className="col-sm-6">
                              
                            </div>
                            <div className="col-sm-6">
                              
                            </div>
                        </div>
                    </div>
                </div>
             
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                              
                                <Outlet />
                                
                            </div>
                        </div>
                      
                    </div>
                    
                </div>
               
            </div>
           
            <aside className="control-sidebar control-sidebar-dark"></aside>
{/* Footer */}
            <Footer />

        </div>
    )
}

export default Admin