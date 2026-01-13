   import { useState,useEffect } from "react";
  import axios from 'axios';
  import { useNavigate } from "react-router-dom";


      

 // admin zone to change user role
 export default function  AdminZone() {
const [pseudoToRole,setPseudoToRole]= useState("");
const [pseudoToBan,setPseudoToBan] = useState('');
const [message,setMessage] = useState('');

// send fetch to update role user on BDD
   async function giveAdmin(e){
        e.preventDefault();
        let act=e.target.value;
        let pseudo = pseudoToRole;
        console.log(act + "   "+ pseudo);
        try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/giveAdmin",
          {
            act,
            pseudo,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(pseudo+" : "+data.message);
        console.log("Réponse backend delete comm :", data);

    
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         setMessage(error.response?.data?.message || "Erreur réseau");
      }
      
      }

      //fetch for update role(ban) on BDD
  async function ban(e){
        e.preventDefault();
        let act=e.target.value;
        let pseudo=pseudoToBan;
        console.log(act);

        try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/ban",
          {
            act,
            pseudo,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(pseudo+" : "+data.message);
        console.log("Réponse backend delete comm :", data);

        // if (data.check) {
        // //navigate(0); 
        // }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         setMessage(error.response?.data?.message || "Erreur réseau");
      }
    }
      
return ( 
<div className=" container-fluid  py-5   " >

  <div className="videoTitle m-3 m-lg-5 justify-content-center">
  <h2 className=" bg-danger-subtle text-danger border rounded-pill p-2 ">Admin Zone</h2>
</div>

      <div className="d-flex  flex-column flex-lg-row justify-content-around">
          <div className="mb-4">
                <h3>BAN/UNBAN User :</h3>
                <p>type pseudo or mail</p>
                <form method="post" action="ban">
                  <input type="text" placeholder="enter pseudo name " minLength="4" name="pseudo"
                  onChange={(e)=>setPseudoToBan(e.target.value)} value={pseudoToBan}/> 

                  <button type="submit" className="btn-warning bg-warning" name="act" 
                  value="ban" onClick={ban}>BAN</button>
                  <button type="submit" className="btn-warning bg-primary" name="act" 
                  value="unban" onClick={ban} >UNBAN</button>
                </form>
              </div>

                <div className="mb-4">
                  <h3>Give Admin Right :</h3>
                  <p>type pseudo or mail</p>

                  <input type="text" placeholder="enter pseudo name" minLength="4" 
                  onChange={(e)=>setPseudoToRole(e.target.value)} value={pseudoToRole} /> 

                  <button type="button" className="btn-warning bg-primary"  
                  value="giveAdmin" onClick={giveAdmin}>Give</button>

                  <button type="button" className="btn-warning bg-warning"  
                  value="removeAdmin" onClick={giveAdmin}>Remove</button>

                </div>

      </div>
                    <p className="text-center text-info">{message}</p>      

</div>
)
 }