import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import Signup from './signup'
import ForgetPassword from './forgetPassword'
 import { NavLink } from 'react-router-dom';


import axios from 'axios';


export default function Signin() {
  const [showSignup, setShowSignup] = useState(false);
  const [mail, setmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
    const navigate=useNavigate();

    const user = useStore((state) => state.user);
   const setUser = useStore((state) => state.setUser)

  
  async function handleSubmit(e) {
    e.preventDefault();

      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/signin",
          {
            mail,
            password,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        setMessage(data.message);
        console.log("Réponse backend :", data);

        if (data.succeed) {
          setUser(data.pseudo);
          navigate("/"); 
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        setMessage(error.response?.data?.message || "Erreur réseau");
      }
  }


  return (
    <div className="d-lg-flex contactGroup">

      {/* SIGN IN SECTION */}
      
          <div className="contactForm-container p-lg-5">
            <div className="container">
              <div className="p-4 bg-white">
                <form className="contactForm" onSubmit={handleSubmit}>
                  <div className="w-100 w-lg-75 mx-auto text-center text-grey">
                    <h2 className="text-center m-4 text-black fw-bold pt-5">Sign in</h2>

                    <div className="logosLogin text-center d-flex justify-content-center">
                       <NavLink to={`${import.meta.env.VITE_API_URL}/auth/google`}><i class="fa-brands fa-google fa-2x p-3"></i></NavLink>
                      <i class="fa-brands fa-facebook fa-2x p-3"  ></i>
                      <i class="fa-brands fa-instagram fa-2x p-3"></i>
                    </div>

                    <h5 className="text-center m-4 text-grey">Or use your email account :</h5>

                    <label htmlFor="mail" className="form-label text-center text-grey fs-4 me-3">
                      Email
                    </label>
                    <input type="email" className="form-control rounded-pill bg-white border border-grey text-center"
                      id="mail" value={mail} onChange={(e) => setmail(e.target.value)} />


                    <label htmlFor="password" className="form-label fs-4 me-3 mt-3">
                      Password
                    </label>
                    <input  type="password"  className="form-control rounded-pill bg-white border border-grey text-center"
                      id="password" value={password} 
                      onChange={(e) => setPassword(e.target.value)} placeholder="Min 4 characters" />
                  </div>


                  <div className="text-center">
                    <button type="submit" className="btn mx-3 fs-5 px-3 mt-4 btn-warning rounded-pill">
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
                    <p className="text-center">{message}</p>

                    
                  <div className="text-center my-3">
                    {/* <a href="">forget your password?</a> */}
                    <ForgetPassword/>
                  </div>

            </div>
          </div>

          {/* OPEN SIGN UP */}
          {!showSignup && (
        <>
          <div className="signupSection py-3">
            <div className="container py-5">
              <div className="p-4 border rounded-4 shadow-sm text-white text-center background-perso">
                <div className="addMargin">
                  <h2 className="m-3 p-3 fw-bold">Hello there, join us</h2>
                  <h5 className="m-3 p-3">Enter your personal details, and join the cooking community</h5>

                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="btn fs-5 p-3 m-3 bg-white rounded-pill"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

        </>
      )}

      {/* SIGN UP SECTION */}
      {showSignup && (<> <Signup setShowSignup={setShowSignup} />
             </>)}

    </div>
  );
}
