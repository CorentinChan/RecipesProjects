import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import Description from '/src/components/recipe/description.jsx'
import Instructions from '/src/components/recipe/instructions.jsx'
import Commentaires from '/src/components/recipe/commentaires.jsx'
import Ingredients from '/src/components/recipe/ingredients.jsx'
import Tags from '/src/components/recipe/tags.jsx'
import CommentForm from '/src/components/recipe/commentForm.jsx'

import { useStore } from "../store/store";

import RecipesReco from '/src/components/recipe/recipesReco.jsx'

import axios from 'axios';


export default function  Recipe({user,userRole}) {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [udpateForm,setUpdateForm]=useState(0);
    const recipeID = useStore((state) => state.recipeID);
    const setRecipeID = useStore((state) => state.setRecipeID);

    //const [recipeID,setRecipeID]=useState(searchParams.get("id")||"690");

   //let recipeID = searchParams.get("id")||"690"; //param id of url
    const [meal, setMeal] = useState(null);
    const [ingredients, setIngredients] = useState(null);

    const location = useLocation();
   
    let measures=[];

  //     const handleRefresh = () => {
  //   setRefresh(prev => prev + 1); // change la key → reconstruit le composant
  // };

  //    useEffect(() => {
  //   setRecipeID(searchParams.get("id"||"690"));

  // }, []); 

   useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRecipeID(searchParams.get("id")||recipeID);
  }, [location.state]); // state contains date.now to be sure to go top

   async function fetchRecipe() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/setRecipeID",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

       if(recipeID===null) setRecipeID(data.recipeID);
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    // load recipe
  useEffect(() => {
  fetchRecipe();
  }, [recipeID]);

    useEffect(() => {
  fetchRecipe();
  }, []);

  useEffect(() => {
  console.log("Meal updated:", meal);
}, [meal]);

    return (<>

 { recipeID &&( <>

       <Description  recipeID={recipeID} userRole={userRole}   />
  <div className="m-1 p-1 m-lg-5 p-lg-3 makeRecipe-container">
<div className="  recipeLeft">

      <Instructions recipeID={recipeID}/>
      <Commentaires recipeID={recipeID} udpateForm={udpateForm} userRole={userRole}  />
  { user&&  <CommentForm recipeID={recipeID} udpateForm={udpateForm} setUpdateForm= {setUpdateForm} />}

           
            </div>


      <div className="recipeRight">
      <Ingredients recipeID={recipeID} />
      <Tags recipeID={recipeID}/>
      </div>

</div>

      { <RecipesReco recipeID={recipeID}/> }

</>
 )}

</>
    );
}