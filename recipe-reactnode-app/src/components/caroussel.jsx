 
  import Card from './card'
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { KeywordContext } from "./keyword";
import axios from 'axios';

 
 
 export default function  Carroussel({keyword,filter}) {
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
     let textSearch=keyword;
     let searchFilter=filter;
     console.log(textSearch+" "+ searchFilter)
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/searchRecipeHome",
          {
            textSearch,
            searchFilter,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        setMeals(data.recipes);
        console.log("Réponse backend :", data);

 
      } catch (error) {
        console.error("error axios :", error);
      }
    }
fetchRecipes();
   
    
  }, [keyword,filter]);

   
   

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
                <Card key={index} title={meal.title} 
                img={meal.image?meal.image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAdnj607fkyztZ3TkKVTdEy-FG-tD-gEGJQ&s"} 
                id={meal.id} note={meal.note} author={meal.auteur} isFavoris={meal.userID?true:false}   />
                // </div>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* boutons indicateurs */}
      <div className="carousel-indicators p-2 w-75 position-static mt-3 flex-nowrap overflow-auto">
                <button className="btn btn-outline-primary bg-white " type="button" data-bs-target="#cardCarousel" data-bs-slide="prev">
                ⬅️ 
              </button>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#cardCarousel"
            data-bs-slide-to={i}
            className={`btn   bg-transparent   ${i === 0 ? "active " : ""} `}
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