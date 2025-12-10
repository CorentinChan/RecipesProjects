import { useState,useEffect } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
 
 export default function  LocationState({setLocationState,user,userRole,setUser,setUserRole,locationState}) {
      const location =useLocation();

  useEffect(async() => {
      console.log("API" + import.meta.env.VITE_API_URL);
 try {
          let pseudo = profil.pseudo;
          let image= profil.image;
          let description = profil.description;
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getPseudo",
          {
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(data.message);
        console.log("Réponse backend :", data);

        if (data.message==="Profil udpated") {
          //setUser(data.pseudo);
          console.log("succeed")
          //setProfilParent(profil);
        navigate(0); 
            console.log("Réponse backend app :", data);
        setUser(data.pseudo);
        setUserRole(data.role);
         console.log("getpseudo and role");
        
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         setMessage(error.response?.data?.message || "Erreur réseau");
      }
    
  }, [location.pathname,user]);



 return( 

<></>

        )}