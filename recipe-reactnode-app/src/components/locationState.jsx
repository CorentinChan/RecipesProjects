import { useState,useEffect } from 'react'
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
 
 export default function  LocationState({setLocationState}) {

    useEffect(() => {
  setLocationState(prev=>prev+1);
  }, [location.pathname]);

 return( 

<></>

        )}