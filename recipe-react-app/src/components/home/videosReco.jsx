import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
  import CardUser from '../cardUser'
  import CardIframe from './cardIframe'


 export default function  VideosReco({keyword}) {

  const [tag, setTag] = useState(keyword);
  const [selection, setSelection] = useState("videos");

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const videos=[ 
{ title : 'How to choose your Vegetables', url:"https://www.youtube.com/embed/KAYJ4-lRTgw" },
{ title : 'Air Fryer Chicken & Veggies ', url:"https://www.youtube.com/embed/zfq_piABTaw" },
{ title : 'The best Cake from Paris', url:"https://www.youtube.com/embed/2nQKUh9G0k4" },
{ title : 'AVOID These 13 Foods', url:"https://www.youtube.com/embed/pdf3eZyupVc" },

];

  // load recipe
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
      if(allMealsFilt.length>4){ 
             let  randomIndex = Math.floor(Math.random() * (allMealsFilt.length - 3));
              let mealsSelect=[];
              for(let i=randomIndex;i<4+randomIndex;i++) {
                  mealsSelect.push(allMealsFilt[i]);
                  
              }
              setMeals(mealsSelect);
          console.log(mealsSelect);
            }
   
      } catch (err) {
        console.error("Erreur API :", err);
      }
      setLoading(false);
    }

  useEffect(() => { 
      fetchRecipes();
  }, [tag]);

   useEffect(() => {
    setTag(keyword);
  }, [keyword]);

  const handleChange = (event) => {
    setSelection(event.target.value);
    if(event.target.value==="random")fetchRecipes();

  }
   

 return( 


       <div className="videoSection my-5 m-lg-5   ">

  <div className="videoTitle m-3 m-lg-5 ">
<h2>VIDEOS</h2>
  <select className="form-select fs-5 rounded-pill  .form-select-video"   defaultValue="videos"  onChange={handleChange}>
    <option selected disabled>Sort by : </option>
    <option value="videos" >Videos</option>
    <option value="recipes" >Recipes</option>
    <option value="random">Random </option>
  </select>
  </div>

<div className="videos-container m-lg-5" id="videos-container">

             {(selection==='recipes'||selection==='random')?meals.map(meal => (
                <CardUser key={meal.idMeal} title={meal.strMeal} img={meal.strMealThumb} id={meal.idMeal}  />
              ))
             :selection==='videos'&&videos.map((video,index) => (
                <CardIframe key= {index} title={video.title} videoUrl={video.url}   />
              ))
              }

</div>
</div>
        )}