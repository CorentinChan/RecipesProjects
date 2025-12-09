import { useState,useEffect } from "react";
import { useStore } from "../../store/store";

import axios from 'axios';
import { NavLink } from "react-router-dom";

import DescriptionAdmin from '/src/components/recipe/descriptionAdmin.jsx'


export default function Decription({recipeID,userRole}){
    const [meal, setMeal] = useState(null);
    const [message, setMessage] = useState("");
    const [nbNotes, setNbNotes] = useState(0);
        const [nbRecipes, setNbRecipes] = useState(0);

    const [isYT, setIsYT] = useState(false);

    const user = useStore((state) => state.user);


    function addList(){
    async function fetchAddList() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/addList",
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
        setMessage(data.message);
            const p = document.getElementById("message");
             
             if(data.message==='List Added') p.style.color = "green";
              else p.style.color = "red";
 
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    console.log(recipeID);
    fetchAddList();

    }

useEffect(() => {
    async function fetchDescription() {
      const ytRegex = /(https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\/\S+)/; // (http(s):)//(www.)?youtube.com||youtu.be/S+

      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/recipeDescription",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        setMeal(data.recipe[0]);
        setNbNotes(data.nbNotes);
        setNbRecipes(data.nbRecipes);

        if(data.recipe[0])
      { //console.log('isyt'+ytRegex.test(data.recipe[0].description));
        setIsYT(ytRegex.test(data.recipe[0].description));
        console.log("Réponse backend descrption :", data);
        console.log(data.recipe[0].image);
      }

 
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    console.log(recipeID);
    fetchDescription();
  }, [recipeID]);

    return(
        <div className="recipeTitle row gx-0">
{ meal&&<>
  <div className="d-lg-flex container ">
        {/* <!--img--> */}
        <div className="col-lg-6">
        <div className=" justify-content-center  image-container">
        <img src={meal.image} className=" tilt1  pt-3 rounded-5 recipePhoto" alt="image"/>
        </div>
          </div>
        {/* <!--description--> */}
    <div className="col-lg-6" >
    <div className=" pt-3 descriptionRecipe">
            {/* <!--title--> */}
    <h1 className="fade-in">{meal.title}</h1>
    <p>{meal.note}  <i  className="fa-solid fa-star"></i> ({nbNotes})</p>
      
   {   isYT?<>
    <p className="text-black-50  fs-4">
       <a href={meal.description} target="_blank" rel="noopener noreferrer">
      
       <i className="fa-brands fa-youtube fs-1"></i></a> </p>
       </>:
       <p> {meal.decription}</p>}

    {/* <!--Recipe info--> */}
    <div className="d-flex text-center  descriptionLogos border-bottom">
        <div className="logo1  p-3 mx-2  m-lg-3 px-lg-5 text-center border-end">
       <i className="fa-regular fa-clock fs-3 rotatec"></i>
       <p className="m-0 p-0" >{meal.activeTime}</p>
        <p className="m-0 p-0 text-black-50 " id="activeTime"></p>
        </div>
        <div className="logo2  p-3 mx-2 m-lg-3 px-lg-5 text-center border-end">  
        <i className="fa-solid fa-clock-rotate-left fs-3 rotatec"></i>
        <p className="m-0 p-0" >{meal.totalTime}</p>
        <p className="m-0 p-0 text-black-50 " id="totalTime"></p>
        </div>
        <div className="logo3 p-3 mx-2 m-lg-3 px-lg-5 text-center"> 
        <i className="fa-solid fa-users fs-3"></i>
        <p className="m-0 p-0" >{meal.yield}</p>
        <p className="m-0 p-0 text-black-50" id="yield"> Serves </p>
        </div>
    </div>


    <div className="d-flex mt-2 bottomDescription align-items-center">
    
    <div className="container ">
    <p className="m-0 p-0">Created by <span className="text-danger" id="author">{meal.auteur}</span> </p>
    <p className="m-0 p-0 text-black-50" id="nbRecipes"> Total recipes : {nbRecipes} </p>
    </div>
       <div className="d-flex justify-content-center align-items-center  ">

            { user&& <><p className="mt-4 " id='message'>{message}</p>       
         <i className="fa-regular fa-plus fs-3 mx-3 clickable" onClick={addList}></i> </>}
        <i className="fa-solid fa-cart-arrow-down fs-3 mx-3 clickable"></i>
        <i className="fa-solid fa-print fs-3 mx-3 clickable" id="print" onClick={window.print}></i>
    </div>
    
    </div>
                 { userRole==="admin"&&<DescriptionAdmin recipeID={recipeID} />}

         </div>

                
    </div>
  </div>
  </>}
</div>

    );
}