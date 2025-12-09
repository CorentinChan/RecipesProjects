import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import CardUser from '../cardUser'
import axios from 'axios';


 export default function  RecipesReco({recipeID}) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipeReco, setRecipeReco] = useState([]);



   async function fetchRecipe() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getRecipeReco",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        console.log("recipe reco "+data.recipeReco)
        setRecipeReco(data.recipeReco);
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    // load recipe
  useEffect(() => {
  fetchRecipe();
  }, [recipeID]);
   
 return( 


       <div className="videoSection2 bg-light container-fluid py-5   ">

  <div className="videoTitle m-3 m-lg-5 ">
<h2>Others recipes you may like</h2>


  </div>

<div className="videos-container2 m-lg-5" id="videos-container">

              {recipeReco.map(meal => (
               // <div key={meal.idMeal}>     
                <CardUser key={meal.id} title={meal.title} img={meal.image} id={meal.id}   author={meal.auteur}  note={meal.note} />
                // </div>
              ))}

</div>
</div>
        )}