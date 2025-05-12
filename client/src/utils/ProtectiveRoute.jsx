import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'


const ProtectiveRoute = () => {
  const loggedIn=localStorage.getItem("loggedUser")
  // console.log(loggedIn)
  return !loggedIn?<Navigate to='/login'/>:<Outlet/>
}

export default ProtectiveRoute