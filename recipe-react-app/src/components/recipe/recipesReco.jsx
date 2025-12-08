import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
  import CardUser from '../cardUser'


 export default function  RecipesReco({tagC,tagA}) {

  let tag=tagC||"chicken";


  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // load recipe
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {

          const urls=["https://www.themealdb.com/api/json/v1/1/filter.php?a=" + tagA,"https://www.themealdb.com/api/json/v1/1/filter.php?c=" + tagC,"https://www.themealdb.com/api/json/v1/1/filter.php?i="+tag]
          const responses = await Promise.all(urls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(res => res.json()));
        // const res = await fetch(url);
        // const data = await res.json();

          const allMeals = data
                  .flatMap(r => r.meals || []); 
          
          const allMealsFilt = allMeals.filter(
                (obj, index, self) =>
                  index === self.findIndex((el) => el.idMeal === obj.idMeal)
              );
              let  randomIndex = Math.floor(Math.random() * (allMealsFilt.length - 7));
              let mealsSelect=[];
              for(let i=randomIndex;i<randomIndex+8;i++) {
                  mealsSelect.push(allMealsFilt[i]);
                  
              }
          setMeals(mealsSelect);
          console.log(mealsSelect);
   
      } catch (err) {
        console.error("Erreur API :", err);
      }
      setLoading(false);
    }
fetchRecipes();
   
    
  }, [tag]);

   useEffect(() => {

   
    
  }, [tag]);

   

 return( 


       <div className="videoSection2 bg-light container-fluid py-5   ">

  <div className="videoTitle m-3 m-lg-5 ">
<h2>Others videos you may like</h2>


  </div>

<div className="videos-container2 m-lg-5" id="videos-container">

              {meals.map(meal => (
               // <div key={meal.idMeal}>     
                <CardUser key={meal.idMeal} title={meal.strMeal} img={meal.strMealThumb} id={meal.idMeal}  />
                // </div>
              ))}

</div>
</div>
        )}