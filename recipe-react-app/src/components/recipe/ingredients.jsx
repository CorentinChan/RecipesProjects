import { createContext, useState, useEffect } from "react";


export default function Ingredients({ingredients}){

      useEffect(() => {
      console.log("ingredients child:", ingredients);
          
    }, [ingredients]);

    return(
<div className="mt-5 mt-lg-0 recipeIngredients">
    <h2>Ingredients</h2>
    <ul className="list-group ingredientsList" >


{ingredients?.map((ingredient, index) => (
  <li key={`ingredient-${index}`} className="list-group-item border-0 border-bottom">
    {ingredient}
  </li>
))}

  
       
    </ul>
    </div>
    );
}