  import { useState,useEffect } from 'react';
import CardUser from '../cardUser'
  import imgCard from '../images/background1.png'

  import axios from 'axios';


export default function  OwnRecipes() {
const [recipes,setRecipes]=useState([])
   useEffect(() => {         
         async function getRecipes(){ 
          const response = await axios.get(import.meta.env.VITE_API_URL+"/getOwnRecipes", {
          headers: {
            "Content-Type": "application/json",
          },
        withCredentials: true,    
             });
          const data = response.data;
        console.log("Réponse backend account:", data);
             setRecipes(data.ownRecipes);
    
            }
          getRecipes();
      }, []);

      async function deleteSubmit(e){
          let recipeID = e.target.value;
          let type = "ownrecipe";
          console.log(recipeID);
                try {

        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/deleteRecipeList",
          {
            recipeID,
            type,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(data.message);
        console.log("Réponse backend :", data);

        if (data.check) {
        navigate(0); 
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         //setMessage(error.response?.data?.message || "Erreur réseau");
      }
  

      }

return ( 
   <div className="videoSection2 bg-light container-fluid py-5" id="fav">
  
    <div className="videoTitle m-3 m-lg-5 justify-content-center">
      <h2 className="bg-danger-subtle text-danger border rounded-pill p-2">
        Your own recipes
      </h2>
    </div>
  
    <div className="videos-container2 m-lg-5 flex-nowrap  overflow-auto" id="videos-container">

      {recipes&&recipes.map( (recipe,index)=>( 
      <div className="cardExt">
        <CardUser key={`ownrecipe ${recipe.id}`} id={recipe.id} title={recipe.title} img= {recipe.image}/>
        <div class="d-flex flex-column flex-lg-row justify-content-around  ">
        <form method="post" action={`modifyForm?recipe=${recipe.id}`}>
          <button class="btn  text-center rounded-pill mx-1  mb-2 bg-primary border border-black" 
          name="modifyOwn" value="recipe.id">Modify</button></form>
          <button class="btn  text-center rounded-pill mx-1  mb-2 bg-danger border border-black" 
          name="deleteOwn" value={recipe.id} onClick={deleteSubmit}>Delete</button>
        </div>
      </div>     
      ))}

    </div>
  
  </div>
  
)
 }