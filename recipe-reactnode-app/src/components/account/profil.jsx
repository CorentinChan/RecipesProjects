  import { useState,useEffect } from "react";
  import axios from 'axios';

  
  import ModalPassword from './modalPassword'
  import ModalProfil from './modalProfil'
  import CreateRecipe from './createRecipe'
  import imgProfil from '../images/dimsumtransp.png'

 
 export default function  Profil({user,userRole}) {
  const [profil,setProfil]=useState("");
  const [message,setMessage]=useState("");

   useEffect(() => {
          
         async function getProfil(){ 
          const response = await axios.get(import.meta.env.VITE_API_URL+"/getProfil", {
          headers: {
            "Content-Type": "application/json",
          },
        withCredentials: true,    
             });
          const data = response.data;
        console.log("Réponse backend cat :", data);
       setProfil(data.user);
       if(!data.user.image||data.user.image==="")data.user.image="https://picsum.photos/400/250?random=1";
    
            }
          getProfil();
      }, []);

return ( 
<div className="d-lg-flex container mx-lg-5 px-lg-5">

{profil&&user&&<>
  {/* description */}
  <div className="col-lg-6 justify-content-center">
    <div className="mx-lg-5 pt-3 descriptionRecipe">
      
      {/* title */}
      <h1 className="fade-in fs-1 text-center mx-lg-5 mt-3 my-lg-5 mb-4">
        Bonjour,
        {userRole === "admin" && <span className="text-warning"> Master</span>} {user} !
      </h1>

      {/* change password / modal buttons */}
      <div className="d-flex text-center descriptionLogos border-bottom border-top">
        <ModalPassword />
        <ModalProfil profilParent={profil} setProfilParent={setProfil} />

        {/* create recipe button */}
        <button
          type="button"
          className="bg-transparent border-0 p-0 m-0"
          data-bs-toggle="modal"
          data-bs-target="#modalCreateRecipe"
        >
          <div className="logo3 p-3 px-lg-5 text-center">
            <i className="fa-solid fa-utensils fs-3"></i>
            <p className="m-0 p-0">Create recipe</p>
          </div>
        </button>

        {/* create recipe modal */}
        <div
          className="modal fade"
          id="modalCreateRecipe"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Create your Recipe</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <CreateRecipe />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center fst-italic m-3 py-lg-4 px-lg-5">
        {profil?.description}
      </div>

    </div>
  </div>

  {/* img */}
  <div className="col-lg-6">
    <div className="justify-content-center image-container">
      <img src={profil?.image} className="tilt1 pt-3 rounded-5 recipePhoto" alt="image" />
    </div>
  </div>
</>}
</div>


);
 }