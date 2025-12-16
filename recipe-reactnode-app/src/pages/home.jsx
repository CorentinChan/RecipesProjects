import { createContext, useState, useContext } from "react";
import Caroussel from '/src/components/caroussel.jsx'
import Signup from '/src/components/signup.jsx'
import SearchBar from '/src/components/searchBar.jsx'
import HomeNav from '/src/components/home/homeNav.jsx'
import Subscribe from '/src/components/home/subscribe.jsx'
import VideosReco from "../components/home/videosReco";

import './home.css'


export default function  Home({user}) {
      const [keyword, setKeyword] = useState("chinese"); // variable globale
      const [showSignup, setShowSignup] = useState(false);
      const [filter, setFilter] = useState(""); 

    return (
        <div>
            <section className="signup-container tilt1 ">

            <div className=" container-fluid ms-2 ms-lg-5 my-5 " >
            <div className="p-4 border rounded-4 shadow-sm text-white background-perso">
                <div className="signup-text">
                <h1>CHOOSE FROM THOUSANDS OF RECIPES</h1>
              {  !user? <> <h3 className="mb-3 "> sign up to access to a lot of recipes, add your own recipes, and many more</h3>
                <a  className =" d-flex text-decoration-none text-white"   >
                    <h3 onClick={()=>setShowSignup(true)} >Sign up today </h3> 
                    <i className="fa-solid fa-arrow-right m-2 p-2 fa-lg" ></i> </a> </> 
                    :<h3 className="mb-3 "> Welcome!  Now, add your own recipes on account page, comment your favorite recipes and many more</h3> }
                </div>
            </div>
            </div>
            </section>

            {showSignup&&<Signup  setShowSignup={setShowSignup}/> }

            <div className="recipeGroup ms-lg-5">

            <HomeNav keyword={keyword} setKeyword={setKeyword} />


            <div className="recipe-container">

                <div className="searchHome">
            <SearchBar  keyword={keyword} setKeyword={setKeyword} filter={filter} setFilter={setFilter}/>
            </div>
            
            <div className="ms-lg-0 recipeList ">
                <Caroussel keyword={keyword} filter={filter}/>
            </div>
        </div>
</div>
        <VideosReco keyword= {keyword}  />
        <Subscribe/>


</div>


    )
}