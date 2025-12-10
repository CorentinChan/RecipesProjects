import { useState, useEffect } from 'react';
import CardUser from '../cardUser';
import imgCard from '../images/background1.png';
import axios from 'axios';
// import { useLocation } from "react-router-dom"; // Inutile ici
import { useNavigate } from "react-router-dom";

export default function RecipesList() {
  // 1. Correction : Ajout du 'const' manquant
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function getRecipes() {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/getRecipesList", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        const data = response.data;
        console.log("Réponse backend favoris:", data);
        
        // Petite sécurité pour éviter le crash si data.recipesList est vide
        if (data && data.recipesList) {
            setRecipes(data.recipesList);
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      }
    }
    getRecipes();
  }, []);

  async function deleteSubmit(recipeID) {
    // recipeID est déjà propre ici grâce à la modif plus bas
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/deleteRecipeList",
        {
          recipeID, 
          type: "favoris",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Réponse backend delete :", data);

      if (data.check) {
        // 2. Correction : On met à jour la liste sans recharger la page (Plus rapide, pas de bug)
        // On garde toutes les recettes SAUF celle qu'on vient de supprimer
        setRecipes(currentRecipes => currentRecipes.filter(r => String(r.id) !== String(recipeID)));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  return (
    <div className="container-fluid py-5" id="fav">
      <div className="videoTitle m-3 m-lg-5 justify-content-center">
        <h2 className="bg-danger-subtle text-danger border rounded-pill p-2">
          Your favorites recipes
        </h2>
      </div>

      <div className="m-lg-5 d-flex flex-nowrap overflow-auto" id="videos-container">
        
        {recipes && recipes.map((recipe, index) => {
          
          // 3. Correction CRUCIALE : On transforme l'ID en String ICI
          // Cela empêche le bug [object Object] dans CardUser et dans Delete
          const safeId = String(recipe.id);

          return (
            <div key={`recipeList-${safeId}`} className="cardExt">
              
              {/* On passe safeId (texte) et pas recipe.id (objet) */}
              <CardUser 
                id={safeId} 
                title={recipe.title} 
                img={recipe.image ? recipe.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAdnj607fkyztZ3TkKVTdEy-FG-tD-gEGJQ&s"}
              />
              
              <div className="d-flex flex-column flex-lg-row justify-content-around">
                <button 
                  className="btn text-center rounded-pill mx-1 mb-2 bg-danger border border-black" 
                  name="deleteOwn" 
                  onClick={() => deleteSubmit(safeId)} // On utilise safeId ici aussi
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}