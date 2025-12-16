import { useState,useEffect } from 'react'
import { useSearchParams } from "react-router-dom";

import Caroussel from '/src/components/caroussel.jsx'
import SearchBar from '/src/components/searchBar.jsx'

import './search.css'


export default function  Search() {
     const [searchParams] = useSearchParams();
     
   let tag = searchParams.get("tag")||"seafood"; 
      const [keyword, setKeyword] = useState(tag); 
      const [filter, setFilter] = useState(""); 
      
   useEffect(() => {
         setKeyword(tag);
  }, [tag]);

    return (
        
 <div>
<SearchBar  keyword={keyword} setKeyword={setKeyword} filter={filter} setFilter={setFilter}/>
<div className='recipeSearch'>
<Caroussel keyword={keyword} filter={filter}/>
</div>

 </div>


    )
}