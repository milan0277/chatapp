import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Clogo from "../assets/download.png"
import Store from '../context/context';
import { FaFacebookSquare } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const Sidebar = () => {
  const loggegUserData = JSON.parse(localStorage.getItem("loggedUser"))
  const { sideState, setSideState } = useContext(Store)

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 ">
      {/* Brand Logo */}
      <Link className="brand-link logo-switch" style={{ backgroundColor: 'whitesmoke' }}>
        <img src="https://cogentems.in/erpm/Style/images/Cogent-Logo_new-white.svg" alt="Cogent Logo" className="brand-image-xs logo-xl" style={{ opacity: "5", maxHeight: "43px", marginLeft: '3.1rem' }} />
        <img src={Clogo} alt="Cogent Small Logo" className="brand-image-xl logo-xs" style={{ opacity: "5", maxHeight: "43px" }} />
      </Link>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="form-inline">
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">

          {loggegUserData?.designation === "admin" ?
            (
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li className={sideState == "/admin" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin")}>
                  <Link to="/admin" className="nav-link" >
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p style={{ fontSize: "18px" }}>
                      Dashboard
                    </p>
                  </Link>
                </li>

                <li className="nav-item menu-open">
                  <Link className="nav-link ">
                    <i className="nav-icon fas fa-th"></i>
                    <p>
                      Manage Users
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </Link>
                  <ul className="nav nav-treeview">
                    <li className={sideState == "/admin/admin-userlist" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin/admin-userlist")}>
                      <Link to="/admin/admin-userlist" className="nav-link ">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Agents List</p>
                      </Link>
                    </li>
                    <li className={sideState == "/admin/admin-userlist2" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin/admin-userlist2")}>
                      <Link to="/admin/admin-userlist2" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Sheet Data</p>

                      </Link>
                    </li>
                    <li className={sideState == "/admin/admin-sendfile" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin/admin-sendfile")}>
                      <Link to="/admin/admin-sendfile" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Bulk Upload</p>

                      </Link>
                    </li>
                  
                  </ul>
                </li>
                <li className={sideState == "/admin/admin-chat" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin/admin-chat")}>
                  <Link to="admin-chat" className="nav-link ">
                    <i className="nav-icon fas fa-edit"></i>
                    {/* <ion-icon  name="chatbubble-ellipses"></ion-icon> */}
                    <p>
                      Chat
                    </p>
                  </Link>
                </li>
                <li className={sideState == "/admin/admin-forms" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin/admin-forms")}>
                  <Link to="admin-forms" className="nav-link ">
                    <i class="nav-icon fas fa-book"></i>
                    <p>
                      New Sheet
                    </p>
                  </Link>
                </li>
                <li className={sideState == "/admin/fbposts" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/admin/fbposts")}>
                  <Link to="admin-fbposts" className="nav-link ">
                  {/* <i class="nav-icon far fa-image"></i> */}
                  <FaFacebookSquare size={"23px"} style={{marginLeft:"2px",marginRight:"5px"}}/>
                    <p>
                      Facebook Posts
                    </p>
                  </Link>
                </li>
              </ul>

            )
            : (
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li className={sideState == "/agent" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/agent")}>
                  <Link to="/agent" className="nav-link " style={{ display: "flex", alignItems: "center" }}>
                    {/* <ion-icon name="person-circle-outline" style={{ fontSize: "30px" }}></ion-icon> */}
                    <ImProfile size={"20px"} style={{marginLeft:"2px",marginRight:"5px"}}/>
                    <p style={{ fontSize: "18px" }}>
                      Profile
                    </p>
                  </Link>
                </li>
                <li className={sideState == "/agent/agent-chat" ? "nav-item bg-blue" : "nav-item "} onClick={() => setSideState("/agent/agent-chat")}>
                  <Link to="agent-chat" className="nav-link ">
                    <i className="nav-icon fas fa-edit"></i>
                    <p>
                      Chat
                    </p>
                  </Link>
                </li>
                
              </ul>

            )


          }



        </nav>

      </div>
      {/* /.sidebar */}

    </aside>
  )
}

export default Sidebar