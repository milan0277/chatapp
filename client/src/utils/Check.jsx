import { Navigate } from "react-router-dom"
import { Route,Routes } from "react-router-dom"
import Test from "../test/Test"
import AgentC from "../components/AgentC"
const Check=()=>{
    const loggedIn=localStorage.getItem("loggedUser")
    return loggedIn?.designation==='admin'?<Route path="*" element={<Test/>}/>:<Route path="*" element={<AgentC/>}/>
        

}

export default Check