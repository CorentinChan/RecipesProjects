import { createContext, useState, useEffect } from "react";
import axios from 'axios';


export default function Ingredients({recipeID}){

          const [ingredients, setIngredients] = useState([]);

     useEffect(() => {
    
      async function fetchIng() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getIngredients",
          {recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        setIngredients(data.ingredients);
        console.log("Réponse backend :", data);

 
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    console.log(recipeID);
    fetchIng();

      }, [recipeID]);

    return(
<div className="mt-5 mt-lg-0 recipeIngredients">
    <h2>Ingredients</h2>
    <ul className="list-group ingredientsList" >


{ingredients?.map((ingredient, index) => (
  <li key={`ingredient-${index}`} className="list-group-item border-0 border-bottom">
   {ingredient.measure} of {ingredient.ingredient} 
  </li>
))}

  
       
    </ul>
    </div>
    );
}