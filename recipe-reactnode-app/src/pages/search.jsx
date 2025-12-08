import { useState,useEffect } from 'react'
import { useSearchParams } from "react-router-dom";

import Caroussel from '/src/components/caroussel.jsx'
import SearchBar from '/src/components/searchBar.jsx'


export default function  Search() {
     const [searchParams] = useSearchParams();
     
   let tag = searchParams.get("tag")||"chicken"; // récupère le paramètre 'tag'
      const [keyword, setKeyword] = useState(tag); // état central
       
   useEffect(() => {
         setKeyword(tag);
  }, [tag]);

    return (
        
 <div>
<SearchBar  keyword={keyword} setKeyword={setKeyword}/>
<div className='recipeSearch'>
<Caroussel keyword={keyword}/>
</div>

 </div>


    )
}