 import '/src/App.css'
 
import { useState,useRef , useEffect } from 'react';
import { KeywordContext } from "./keyword";


 
 export default function SearchBar({ keyword, setKeyword }) {
  const [inputValue, setInputValue] = useState(keyword);
  const skipTimeout = useRef(false);

  function handleSubmit() {
    skipTimeout.current = true;
    setKeyword(inputValue);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!skipTimeout.current) {
        setKeyword(inputValue);
        skipTimeout.current = false;

      }
    }, 100);

    return () => clearTimeout(handler);
  }, [inputValue]);

    useEffect(() => {

        setInputValue(keyword);

  }, [keyword]);

 return( 
  

<section className="d-lg-flex recipeForm mx-lg-5 ">

  <div className="container mt-3  justify-content-between " >
  <div className="d-lg-flex ms-lg-3" role="search">
    
        <div className="input-group w-lg-50 slide-in-blurred-left">

      <span className="input-group-text btnSearch" id="basic-addon1 " onClick={handleSubmit} >
            <i className="fa-solid fa-magnifying-glass "  ></i>
      </span>  
       
      <input type="text" className="form-control w-lg-50" placeholder="Search"
       id="textSearch" aria-label="Search" aria-describedby="basic-addon1" onChange={(e) => setInputValue(e.target.value)} 
      value={inputValue}
      />
    </div>
  </div>
</div>


<div className="searchList mt-2">
  <select className="form-select fs-5 rounded-pill form-select-lg mx-2 mx-lg-5"  id="recipeFilter">
    <option selected disabled>Sort by : </option>
    <option value="recipeDate">Sort by : date</option>
    <option value="recipeAlpha">Sort by : A to Z</option>
    <option value="recipeNote">Sort by : note </option>
  </select>
</div>  

</section>
       

     
 )}