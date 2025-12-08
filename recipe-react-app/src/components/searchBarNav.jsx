 import '/src/App.css'
import { useState,useContext,useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


 
 export default function  SearchBarNav() {
  const [keySearch, setKeySearch] = useState("");
  const [showGlass, setShowGlass] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const location = useLocation();   // contient la route actuelle

 useEffect(() => {
    setShowGlass(false);
  }, [location.pathname]); // close search bar when route

  useEffect(() => {
    function handleClickOutside(event) {
      // si on clique en dehors de l'élément référencé
      if ( ref.current && !ref.current.contains(event.target)) {
        setShowGlass(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


   function handleChange(e) {
   e.preventDefault();    // avoid submit
     if (e.key === 'Enter') {
    handleSubmit(e);       // submit function
  }
    setKeySearch(e.target.value);
  }

  function handleSubmit(e) {

        e.preventDefault();
  glass.classList.add('rotatec');
  //const searchWindow = document.getElementById('searchWindow'); 

    if(showGlass===true){ 
    console.log("Mot-clé avant redirection :", keySearch);

    let url = "/search?tag="+keySearch;
      navigate(url);
    }
    else 
      { 
            setTimeout(() => {    searchWindow.classList.add('slide-in-blurred-left')
    }, 1); 
    setShowGlass(true); 
  }

       }
  

 return( 
<div>
    <form  ref={ref} className="d-flex mt-1" onSubmit={handleSubmit}>
 
 {showGlass&&<input   type="text" className="form-control  w-100  " id='searchWindow'   value={keySearch} onChange={handleChange} />   }      
  <button type="submit" className="btn clickable bg-grey"   >
    <i className="fa-solid fa-magnifying-glass    " id='glass'></i>
  </button>     
  </form>
      
</div>
     
 )}