  import { useState,useEffect } from 'react';
  import CardUser from '../cardUser'
  import imgCard from '../images/background1.png'

  import axios from 'axios';
  import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


 export default function  RecipesList() {
  // const location=useLocation();
   const navigate=useNavigate();
const [recipes,setRecipes]=useState([]);

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

   useEffect(() => {         
          getRecipes();
      }, []);

       async function deleteSubmit(recipeID){
          //let recipeID = e.target.value;
          let type = "favoris";
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

        //setMessage(data.message);
        console.log("Réponse backend delete list :", data);

        if (data.check) {
          console.log("delete recipelist")
        //getRecipes();
              setRecipes(currentRecipes => currentRecipes.filter(r => String(r.recipeID) !== recipeID));

        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         //setMessage(error.response?.data?.message || "Erreur réseau");
      }
  

      }


return ( 
 <div className=" container-fluid py-5" id="fav">

  <div className="videoTitle m-3 m-lg-5 justify-content-center">
    <h2 className="bg-danger-subtle text-danger border rounded-pill p-2">
      Your favorites recipes
    </h2>
  </div>

    <div className=" m-lg-5 d-flex flex-nowrap  overflow-auto" id="videos-container">

      {recipes&&recipes.map( (recipe,index)=> {
                  const recipeID = String(recipe.id);
       return( <div key={`recipeList ${recipeID}`} className="cardExt">
        <CardUser  id={recipeID} title={recipe.title} 
        img={recipe.image?recipe.image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAdnj607fkyztZ3TkKVTdEy-FG-tD-gEGJQ&s"}
         />
        <div className="d-flex flex-column flex-lg-row justify-content-around ">
        
      <button className="btn  text-center rounded-pill mx-1  mb-2 bg-danger border border-black" 
          name="deleteOwn" onClick={() => deleteSubmit(recipeID)}>Delete</button>
          </div>
      </div>   )  
      })}
</div>
</div>

)
 }