 
  import Card from './card'
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { KeywordContext } from "./keyword";

 
 
 export default function  Carroussel({keyword}) {
 const slides = [];
  let group = [];
  
  //let tag='chicken';
    const [searchParams] = useSearchParams();
  let tag = keyword;

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // load recipe
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {

          const url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + tag;
          const urls=["https://www.themealdb.com/api/json/v1/1/filter.php?a=" + tag,"https://www.themealdb.com/api/json/v1/1/filter.php?c=" + tag,"https://www.themealdb.com/api/json/v1/1/filter.php?i="+tag]
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

          setMeals(allMealsFilt);
   
      } catch (err) {
        console.error("Erreur API :", err);
      }
      setLoading(false);
    }
fetchRecipes();
   
    
  }, [tag]);

   
   

  // grouper les recettes par 12
  meals.forEach((meal, index) => {
    if (index > 0 && index % 12 === 0) {
      slides.push(group);
      group = [];
    }
    group.push(meal);
  });
  slides.push(group); // dernière slide

  return (
    <div id="cardCarousel" className="carousel slide">
      <div className="carousel-inner p-2 p-lg-4">

        {slides.map((slide, slideIndex) => (
          <div
            className={` ms-lg-5  carousel-item ${slideIndex === 0 ? "active" : ""}`}
            key={slideIndex}>
            <div className="row g-3 ">
              {slide.map((meal,index) => (
               // <div key={meal.idMeal}>     
                <Card key={index} title={meal.strMeal} img={meal.strMealThumb} id={meal.idMeal}  />
                // </div>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* boutons indicateurs */}
      <div className="carousel-indicators position-static mt-3">
                <button className="btn btn-outline-primary bg-white " type="button" data-bs-target="#cardCarousel" data-bs-slide="prev">
                ⬅️ 
              </button>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#cardCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
            <button className="btn btn-outline-primary bg-white" type="button" data-bs-target="#cardCarousel" data-bs-slide="next">
            ➡️
          </button>
      </div>
       
    </div>
  );
        }