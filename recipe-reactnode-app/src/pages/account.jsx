import { createContext, useState, useContext } from "react";
import Profil from '/src/components/account/profil.jsx';
import CommentsList from '/src/components/account/commentsList.jsx';
import RecipesList from '/src/components/account/recipesList.jsx';
import OwnRecipes from '/src/components/account/OwnRecipes.jsx';
import AdminZone from '/src/components/account/AdminZone.jsx';




export default function  Account({user,userRole}) {
 
    
  // if (!user||!userRole) {
  //   return <div>Chargement...</div>;
  // }
      
    return (
        user&&<>
        
       <Profil  user={user} userRole={userRole}  />
       <CommentsList/> 
        <RecipesList/> 
        <OwnRecipes/>
        {(userRole==="admin")?<AdminZone/>:undefined} 

        </>
    )
}