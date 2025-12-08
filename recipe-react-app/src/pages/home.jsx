import { createContext, useState, useContext } from "react";
import Caroussel from '/src/components/caroussel.jsx'
import Signup from '/src/components/signup.jsx'
import SearchBar from '/src/components/searchBar.jsx'
import HomeNav from '/src/components/home/homeNav.jsx'
import Subscribe from '/src/components/home/subscribe.jsx'
import VideosReco from "../components/home/videosReco";




export default function  Home() {
      const [keyword, setKeyword] = useState("beef"); // variable globale
      const [showSignup, setShowSignup] = useState(false);

    return (
        <div>
            <section className="signup-container tilt1 ">

            <div className=" container-fluid ms-2 ms-lg-5 my-5 " >
            <div className="p-4 border rounded-4 shadow-sm text-white background-perso">
                <div className="signup-text">
                <h1>CHOOSE FROM THOUSANDS OF RECIPES</h1>
                <h3 className="mb-3 "> sign up to acess to a lot of recipes, add your own recipes, and many more</h3>
                <a  className =" d-flex text-decoration-none text-white"   ><h3 onClick={()=>setShowSignup(true)} >Sign up today </h3> <i className="fa-solid fa-arrow-right m-2 p-2 fa-lg" ></i> </a>
                </div>
            </div>
            </div>
            </section>

            {showSignup&&<Signup  setShowSignup={setShowSignup}/> }

            <div className="recipeGroup ms-lg-5">

            <HomeNav keyword={keyword} setKeyword={setKeyword} />


            <div className="recipe-container">


            <SearchBar  keyword={keyword} setKeyword={setKeyword}/>
            
            <div className="ms-lg-0 recipeList recipeSearch">
                <Caroussel keyword={keyword}/>
            </div>
        </div>
</div>
        <VideosReco keyword= {keyword} />
        <Subscribe/>


</div>


    )
}