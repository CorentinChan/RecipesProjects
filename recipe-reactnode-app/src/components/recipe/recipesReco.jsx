import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
  import CardUser from '../cardUser'


 export default function  RecipesReco({recipeReco}) {



  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {

  }, [  ]);

   
 return( 


       <div className="videoSection2 bg-light container-fluid py-5   ">

  <div className="videoTitle m-3 m-lg-5 ">
<h2>Others videos you may like</h2>


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