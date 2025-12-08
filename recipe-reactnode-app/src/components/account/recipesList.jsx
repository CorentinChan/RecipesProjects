  import { useState,useEffect } from 'react';
  import CardUser from '../cardUser'
  import imgCard from '../images/background1.png'

  import axios from 'axios';


 export default function  RecipesList() {

const [recipes,setRecipes]=useState([])
   useEffect(() => {         
         async function getRecipes(){ 
          const response = await axios.get(import.meta.env.VITE_API_URL+"/getRecipesList", {
          headers: {
            "Content-Type": "application/json",
          },
        withCredentials: true,    
             });
          const data = response.data;
        console.log("Réponse backend account:", data);
             setRecipes(data.recipesList);
    
            }
          getRecipes();
      }, []);


return ( 
 <div className="videoSection2 container-fluid py-5" id="fav">

  <div className="videoTitle m-3 m-lg-5 justify-content-center">
    <h2 className="bg-danger-subtle text-danger border rounded-pill p-2">
      Your favorites recipes
    </h2>
  </div>

      <div className="videos-container2 m-lg-5 flex-nowrap  overflow-auto" id="videos-container">

      {recipes&&recipes.map( (recipe,index)=>( 
      <div className="cardExt">
        <CardUser key={`ownrecipe ${recipe.id}`} id={recipe.id} title={recipe.title} img= {recipe.image}/>
        <div class="d-flex flex-column flex-lg-row justify-content-around ">
        <form method="post" action={`modifyForm?recipe=${recipe.id}`}>
          <button class="btn  text-center rounded-pill mx-1 mb-2 bg-primary border border-black" name="modifyOwn" value="recipe.id">Modify</button></form>
          <form method="post" action="deleteOwn">
          <button class="btn  text-center rounded-pill mx-1 mb-2 bg-danger border border-black" name="deleteOwn" value="recipe.id">Delete</button></form>
        </div>
      </div>     
      ))}
</div>
</div>

)
 }