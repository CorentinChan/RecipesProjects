import { useState,useEffect } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
 
 export default function  LocationState({setLocationState,user,userRole,setUser,setUserRole,locationState}) {
      const location =useLocation();

  useEffect(async() => {
      console.log("API" + import.meta.env.VITE_API_URL);
 try {
     
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getPseudo",
          {
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        console.log("Réponse backend :", data);

       
        setUser(data.pseudo);
        setUserRole(data.role);
         console.log("getpseudo and role");
        
        
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    
  }, [location.pathname,user]);



 return( 

<></>

        )}