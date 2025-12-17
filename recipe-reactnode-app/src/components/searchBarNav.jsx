 import '/src/App.css'
import { useState,useContext,useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";


 
 export default function  SearchBarNav({setSearchDisplay}) {
  const [keySearch, setKeySearch] = useState("");
  const [showGlass, setShowGlass] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const location = useLocation();   // contient la route actuelle

 useEffect(() => {
    setShowGlass(false);
    setSearchDisplay(false);
  }, [location.pathname]); // close search bar when route

  useEffect(() => {
    function handleClickOutside(event) {
      // si on clique en dehors de l'élément référencé
      if ( ref.current && !ref.current.contains(event.target)) {
        setShowGlass(false);setSearchDisplay(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


   function handleChange(e) {
   e.preventDefault();    // avoid submit
       setKeySearch(e.target.value);
     if (e.key === 'Enter') {
        let url = "/search?tag="+keySearch;
      navigate(url);
  }
  }

  function handleSubmit(e) {

        e.preventDefault();
  glass.classList.add('rotatec');
  //const searchWindow = document.getElementById('searchWindow'); 

    if(showGlass===true){ 
    console.log("Mot-clé avant redirection :", keySearch);
    setShowGlass(false); 
    let url = "/search?tag="+keySearch;
      navigate(url);
    }
    else 
      { 
            setTimeout(() => {    searchWindow.classList.add('slide-in-blurred-left')
    }, 1); 
    setShowGlass(true);
     //isMobile = window.matchMedia("(max-width: 768px)").matches;
    if(isMobile) setSearchDisplay(true);
  }

       }
  

 return( 
<div>
    <form  ref={ref}  className="d-flex mt-2" onSubmit={handleSubmit}>
 
 {showGlass&&<input   type="text" className="form-control  w-100 rounded-5  " id='searchWindow' placeholder='search a recipe'
               value={keySearch} onChange={handleChange} />   }      

  <button type="submit" className="btn clickable bg-grey"   >
    <i className="fa-solid fa-magnifying-glass    " id='glass'></i>
  </button>     
  </form>
      
</div>
     
 )}