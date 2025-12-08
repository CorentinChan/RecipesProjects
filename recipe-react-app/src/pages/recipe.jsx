import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Description from '/src/components/recipe/description.jsx'
import Instructions from '/src/components/recipe/instructions.jsx'
import Commentaires from '/src/components/recipe/commentaires.jsx'
import Ingredients from '/src/components/recipe/ingredients.jsx'
import Tags from '/src/components/recipe/tags.jsx'

import RecipesReco from '/src/components/recipe/recipesReco.jsx'



export default function  Recipe() {
     const [searchParams] = useSearchParams();
       const [loading, setLoading] = useState(true);

   let recipeID = searchParams.get("id")||"52772"; // récupère le paramètre 'tag'
    const [meal, setMeal] = useState(null);
      const [ingredients, setIngredients] = useState(null);


   
    let measures=[];

      const handleRefresh = () => {
    setRefresh(prev => prev + 1); // change la key → reconstruit le composant
  };

    // load recipe
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + recipeID;
        const res = await fetch(url);
        const data = await res.json();

        if (data.meals) {
          setMeal(data.meals[0]);


        } else {
          setMeal([]);
          //alert("Aucune recette trouvée pour : " + tag);
        }
      } catch (err) {
        console.error("Erreur API :", err);
      }
      setLoading(false);
    }

    fetchRecipes();
  }, [recipeID]);

  useEffect(() => {
  console.log("Meal updated:", meal);
      if(meal){ 
        console.log("meal exist")
            let NewIngredients=[];
            for(let i=1;i<=20;i++){
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
              NewIngredients.push(measure+ '   '+ingredient);
            }
            
          }
           setIngredients(NewIngredients);
           console.log(NewIngredients);
        }
}, [meal]);

    return (<>

 { meal&&ingredients &&( <>

       <Description title={meal.strMeal} img={meal.strMealThumb} description={meal.strYoutube} author={"DBMeal"  } />
  <div className="m-1 p-1 m-lg-5 p-lg-3 makeRecipe-container">
<div className="  recipeLeft">

      <Instructions instructions ={meal.strInstructions}/>
      <Commentaires/>
           
            </div>


      <div className="recipeRight">
      <Ingredients  ingredients={ingredients} />
      <Tags tags={meal.strTags}/>
      </div>

</div>

      <RecipesReco tagA={meal.strArea}  tagC={meal.strCategory}/>

</>
 )}

</>
    );
}