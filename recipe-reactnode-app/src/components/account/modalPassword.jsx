
  import { useState } from "react";

  import { useNavigate } from "react-router-dom";
  import axios from 'axios';


export default function Profil({ user, userRole }) {
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [newPassword2,setNewPassword2]=useState("");
  const [message,setMessage]=useState("");

  
  async function handleSubmit(){
    console.log(currentPassword);
    let passwordNew=newPassword;
    let passwordNew2=newPassword2;
    let passwordCurrent=currentPassword;

    try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/changePassword",
          {
            passwordNew,
            passwordNew2,
            passwordCurrent,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(data.message);
        console.log("Réponse backend :", data);

        // if (data.succeed) {
        //   //setUser(data.pseudo);
        //   console.log("succed")
        //   navigate("/account"); 
        // }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         setMessage(error.response?.data?.message || "Erreur réseau");
      }
    }
  

  return (
    <div>
                <button type="button" className=" bg-transparent border-0" data-bs-toggle="modal" 
                data-bs-target="#passwordModal">
              
                  <div className="logo1  p-3  px-lg-3 align-items-center text-center border-end">
                    <i className="fa-solid fa-key fs-3"></i>
                    <p className="m-0 p-0">Change password</p>
                  </div>
              
                </button>
      {/* Modal */}
      <div className="modal fade mt-5" id="passwordModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modify your password</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="changePasswordForm" onSubmit={handleSubmit}>
              <div className="modal-body d-flex flex-column align-items-center">
                {/* current password */}
                <label className="form-label">Current password</label>
                <input type="password" className="form-control form-control-sm mb-5 p-2 w-75" minLength="4" 
                name="passwordCurrent" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
                {/* new password */}
                <label className="form-label">New password</label>
                <input type="password" className="form-control form-control-sm mb-5 p-2 w-75" minLength="4" 
                name="passwordNew" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                {/* check password */}
                <label className="form-label">Retype password</label>
                <input type="password" className="form-control form-control-sm mb-5 p-2 w-75" minLength="4" 
                name="passwordNew2" value={newPassword2} onChange={(e)=>setNewPassword2(e.target.value)}/>
              </div>
            </form>
                    <p className="text-center  text-info">{message}</p>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
              <button type="button" className="btn btn-primary" 
              id="changePasswordButton" onClick={handleSubmit}>Change password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
