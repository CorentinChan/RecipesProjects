import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

import axios from 'axios';

export default function Signup({setShowSignup}) {
const navigate=useNavigate();
const [message,setMessage]=useState("");
let mailInput= useRef("");
let passwordInput= useRef("");
let pseudoInput=useRef('');
function overlayClick() {
setShowSignup(false);
}

async function handleSubmit(e){
e.preventDefault();
console.log(mailInput.current.value);

let  mail=mailInput.current.value;
let pseudo=pseudoInput.current.value;
let password=passwordInput.current.value;

//call API pour s'inscrire en envoyant mail,pseudo,password, le backend va checker les conditions d'inscriptions 
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/signup",
          {
            mail,
            pseudo,
            password,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(data.message);//reponse du backend
        console.log("Réponse backend :", data);


        // verifie si l'inscription a été effectué
        if (data.succeed) {
          //setUser(data.pseudo);
          console.log("succed")
          navigate("/account"); 
          setShowSignup(false);
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         setMessage(error.response?.data?.message || "Erreur réseau");
      }
      

}

  return (
   
   
<div className="overlay" id="overlay2" onClick={overlayClick}> {/*overlay du signup*/}
    <div className="container signup"   >
      
    {/*close button*/}
      <button
        type="button"
        className="btn btnAc text-center btn-danger border p-1 btnClose2"
        aria-label="Close"
        onClick={()=>setShowSignup(false)}    >
        X
      </button>


{/*signup form*/}
      <div className="p-4 bg-danger border text-white rounded-5" onClick={(e) => e.stopPropagation()}>

        <form className="contactForm" onSubmit={handleSubmit}>
          <div className="mx-auto text-center text-grey formAlign">

            <h2 className="text-center m-3 fw-bold pt-2">Sign up</h2>

            <a href="/signin" className="text-center m-3">
              Have already an account? Click here to connect!
            </a>

            <h5 className="text-center m-3">
              Join us and add your own recipes and many more!
            </h5>

            {/* Email */}
            <label htmlFor="signupMail" className="form-label text-grey fs-4 me-3">
              Email
            </label>
            <input
              type="email"  id="signupMail"   placeholder="tom@company.com" ref={mailInput} 
              className="form-control rounded-pill text-black bg-white border border-grey text-center"
            />

            {/* Pseudo */}
            <label htmlFor="signupPseudo" className="form-label text-grey fs-4 me-3 mt-3">
              Pseudo
            </label>
            <input
              type="text"   id="signupPseudo"  placeholder="JohnDoe" ref={pseudoInput} 
              className="form-control text-center text-black w-50 rounded-pill bg-white border border-grey"            
            />

            {/* Password */}
            <label htmlFor="signupPassword" className="form-label fs-4 me-3 mt-3"> 
              Password
            </label>
            <input
              type="password" id="signupPassword"  placeholder="Min 4 characters" ref={passwordInput} 
              minLength={4}
              className="form-control text-center text-black w-50 rounded-pill bg-white border border-grey"
            />
          </div>

          <div className="text-center">
                <p class="pt-3 fst-italic fs-5 text-info">When you sign up, you agree to our <a target="_blank" rel="noopener noreferrer" href="https://corentinchan.de/terms">terms and conditions</a>
        </p>
            <button type="submit" className="btn btnAc mx-3 fs-5 px-3 mt-3 btn-warning rounded-pill">
              Sign up!
            </button>
          </div>

        </form>
                    <p className="text-center mt-2 text-info">{message}</p>

      </div>
    </div>
</div>
  );
}
