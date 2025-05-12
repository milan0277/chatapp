import React, { useState,useEffect } from 'react'
import Store from './context'
import { useLocation } from 'react-router-dom';

const StoreProvider = ({children}) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("loggedUser")) || null;
  });
  // const location = useLocation().pathname
  const [sideState,setSideState]=useState("")
  const [addressCount,setAddressCount] = useState(0)
  // for(i=0;i<=AddresCount;i++){
  //   return const [addAddresCount,setAddAddressCount] = useState([])
  // }
  const [addAddresCount,setAddAddressCount] = useState([])
  // const [addField,setAddField] = useState([])
  const [dFiled,setDField] = useState(null)
  const [addField, setAddField] = useState([
    { id: 1, fields: [{ value: "" }] },
  ]);


  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("loggedUser");
    }
  }, [user]);

      return (
    <Store.Provider value={{user,setUser,sideState,setSideState,addAddresCount,setAddAddressCount,addField,setAddField}}>
        {children}
    </Store.Provider>
  )
}

export default StoreProvider