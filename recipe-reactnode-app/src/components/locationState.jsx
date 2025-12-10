import { useState,useEffect } from 'react'
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
 
 export default function  LocationState({setLocationState,user,userRole,setUser,setUserRole,locationState}) {
      const location =useLocation();

  useEffect(() => {
      console.log("API" + import.meta.env.VITE_API_URL);

     async function getPseudo(){ 
      const response = await fetch(import.meta.env.VITE_API_URL+"/getPseudo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

         });

    const data = await response.json();
    console.log("Réponse backend app :", data);
        setUser(data.pseudo);
        setUserRole(data.role);
         console.log('userrole'+user+userRole+locationState);
        }
      getPseudo();
      console.log('userrole'+user+userRole+locationState);
      setLocationState(prev=>prev+1);
  }, [location.pathname,user]);



 return( 

<></>

        )}