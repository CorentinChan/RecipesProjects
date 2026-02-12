import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {Helmet} from "react-helmet";


import Description from "/src/components/recipe/description.jsx";
import Instructions from "/src/components/recipe/instructions.jsx";
import Commentaires from "/src/components/recipe/commentaires.jsx";
import Ingredients from "/src/components/recipe/ingredients.jsx";
import Tags from "/src/components/recipe/tags.jsx";
import Share from "/src/components/recipe/share.jsx";
import CommentForm from "/src/components/recipe/commentForm.jsx";

import { useStore } from "../store/store";

import RecipesReco from "/src/components/recipe/recipesReco.jsx";

import axios from "axios";

export default function Recipe({ user, userRole }) {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [udpateForm, setUpdateForm] = useState(0);
  const recipeID = useStore((state) => state.recipeID);
  const setRecipeID = useStore((state) => state.setRecipeID);

  //const [recipeID,setRecipeID]=useState(searchParams.get("id")||"690");

  //let recipeID = searchParams.get("id")||"690"; //param id of url
  const [meal, setMeal] = useState(null);
  const [ingredients, setIngredients] = useState(null);

  const location = useLocation();

  let measures = [];

  //     const handleRefresh = () => {
  //   setRefresh(prev => prev + 1); // change la key → reconstruit le composant
  // };

  //    useEffect(() => {
  //   setRecipeID(searchParams.get("id"||"690"));

  // }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setRecipeID(searchParams.get("id") || recipeID);
  }, [location.state]); // state contains date.now to be sure to go top

  async function fetchRecipe() {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/setRecipeID",
        {
          recipeID,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (recipeID === null) setRecipeID(data.recipeID);
    } catch (error) {
      console.error("error axios :", error);
    }
  }
  // load recipe
  useEffect(() => {
    fetchRecipe();
    const url = "https://corentinchan.de/recipe?id=" + recipeID;
  }, [recipeID]);

  useEffect(() => {
    fetchRecipe();
  }, []);

  useEffect(() => {
    console.log("Meal updated:", meal);
  }, [meal]);

  return (
    <>
<Helmet>
  {/* Title */}
  <title>Recipe {meal?.title || 'Recipe'} | App Recipe</title>

  {/* Meta Description & Keywords */}
  <meta
    name="description"
    content={meal?.description?.trim() || `Detailed recipe of ${meal?.title || 'Recipe'} on App Recipe.`}
  />
  <meta
    name="keywords"
    content={`${meal?.title || ''}, recipe, cooking, ${meal?.category || ''}`}
  />

  {/* Open Graph */}
  {meal?.image && (
    <>
      <meta property="og:image" content={meal.image} />
      <meta property="og:image:alt" content={`Photo of ${meal.title}`} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  )}

  <meta property="og:title" content={`Detailed recipe: ${meal?.title || ''}`} />
  <meta
    property="og:description"
    content={meal?.description?.trim() || `Recipe: ${meal?.title || ''}`}
  />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={window.location.href} />

  {/* JSON-LD Recipe Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Recipe",
      name: meal?.title || 'Recipe',
      image: meal?.image ? [meal.image] : undefined,
      description: meal?.description?.trim() || `Recipe: ${meal?.title || 'Recipe'}`,
      datePublished: meal?.date,
      author: {
        "@type": "Person",
        name: meal?.auteur || "Unknown",
      },
      recipeCategory: meal?.categoryID ? `Category ${meal.categoryID}` : undefined,
      totalTime: meal?.totalTime ? `${meal.totalTime} minutes` : undefined,
      prepTime: meal?.activeTime ? `${meal.activeTime} minutes` : undefined,
      recipeYield: meal?.yield || undefined,
      aggregateRating: meal?.note
        ? {
            "@type": "AggregateRating",
            ratingValue: meal.note,
            reviewCount: 1,
          }
        : undefined,
    })}
  </script>
</Helmet>


      {recipeID && (
        <>
          <Description
            recipeID={recipeID}
            userRole={userRole}
            udpateForm={udpateForm}
            meal={meal}
            setMeal={setMeal}
          />
          <div className="m-1 p-1 m-lg-5 p-lg-3 makeRecipe-container">
            <div className="  recipeLeft">
              <Instructions recipeID={recipeID} />
              <Commentaires
                recipeID={recipeID}
                udpateForm={udpateForm}
                userRole={userRole}
              />
              {user && (
                <CommentForm
                  recipeID={recipeID}
                  udpateForm={udpateForm}
                  setUpdateForm={setUpdateForm}
                />
              )}
            </div>

            <div className="recipeRight">
              <Ingredients recipeID={recipeID} />
              <Tags recipeID={recipeID} />
              <Share recipeID={recipeID} meal={meal} />
            </div>
          </div>

          {<RecipesReco recipeID={recipeID} />}
        </>
      )}
    </>
  );
}
