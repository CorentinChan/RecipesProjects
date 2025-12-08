import { useState,useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function ModalProfil({ user,profilParent,setProfilParent }) {
  const [profil,setProfil]=useState(profilParent);
  const [message,setMessage]=useState("");
  const navigate=useNavigate();

   useEffect(() => {
    setProfil(profilParent);
      }, [profilParent]);

  async function submitFct(e) {
    e.preventDefault();
    console.log(profil);

        try {
          let pseudo = profil.pseudo;
          let image= profil.image;
          let description = profil.description;
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/modifyProfil",
          {
            pseudo,
            image,
            description,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(data.message);
        console.log("Réponse backend :", data);

        if (data.message==="Profil udpated") {
          //setUser(data.pseudo);
          console.log("succeed")
          //setProfilParent(profil);
        navigate(0); 
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         setMessage(error.response?.data?.message || "Erreur réseau");
      }
  }

  return (
    <>
      <button
        type="button"
        className="bg-transparent border-0 p-0 m-0"
        data-bs-toggle="modal"
        data-bs-target="#profilModal"
      >
        <div className="logo3 p-3 px-4 px-lg-5 text-center border-end">
          <i className="fa-solid fa-users fs-3"></i>
          <p className="m-0 p-0">Modify profil</p>
        </div>
      </button>




        <div className="modal fade mt-5" id="profilModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <form onSubmit={submitFct}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Modify Profil</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div className="modal-body d-flex flex-column align-items-center">
          <label htmlFor="pseudo" className="form-label">Pseudo</label>
          <input className="form-control form-control-sm mb-5 p-2 w-75" type="text" 
          minLength={3} value={profil.pseudo} onChange={(e)=>setProfil(prev => ({  ...prev,
          pseudo: e.target.value}))} />

          <label htmlFor="image" className="form-label">Your Picture</label>
          <input className="form-control form-control-sm mb-5 p-2 w-100" type="text" placeholder="" name="image"
          minLength={3} value={profil.image} onChange={(e)=>setProfil(prev => ({  ...prev,
          image: e.target.value}))} />

          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control mb-5 p-2 w-100" placeholder="description" name="description"
          minLength={3} value={profil.description} onChange={(e)=>setProfil(prev => ({  ...prev,
          description: e.target.value}))}></textarea>

          <p className="text-center text-info">{message}</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</div>



            

     </>
  );
}
