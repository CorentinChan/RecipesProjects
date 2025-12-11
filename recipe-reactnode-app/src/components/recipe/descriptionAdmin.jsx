import { useState,useEffect } from "react";

import axios from 'axios';
import { NavLink } from "react-router-dom";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";



export default function DecriptionAdmin({recipeID}){
    const [message, setMessage] = useState("");
    const navigate=useNavigate();
    const setRecipeID = useStore((state) => state.setRecipeID);



    async function deleteRecipe() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/deleteRecipe",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        console.log("Réponse backend description :", data);
        console.log(data.message);
        //setMessage(data.message);
         if(data.check){
            navigate("/recipe");
            setRecipeID(null)
        }
 
      } catch (error) {
        console.error("error axios :", error);
      }
    }


    return(
       

             <div className=" w-75 d-flex justify-content-between mt-5 noprint">
                <p className="mx-3 rounded-pill  p-1">Recipe ID : {recipeID} </p>
              <button type="button"  onClick={()=>navigate("/modifyRecipe", { state: { recipeID:recipeID } })}
              className=" btn-outline-primary bg-primary mx-2 rounded-pill border border-black p-1 ">Modify recipe</button> 
              

              <button type="button" name="recipeID" value={recipeID } onClick={deleteRecipe}
                className=" btn-warning bg-danger mx-2 rounded-pill border  border-black p-1">Delete recipe</button> 
                </div>
                
   

    );
}