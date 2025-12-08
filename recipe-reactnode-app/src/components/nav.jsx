 import SearchBarNav from './searchBarNav'
  import Signup from './signup'
  import { useState } from "react";

 import { NavLink } from 'react-router-dom';
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";


 
 export default function  Nav({}) {
  const [showSignup, setShowSignup] = useState(false);
    const user = useStore((state) => state.user);
      const setUser = useStore((state) => state.setUser);
      const pathTab= [{path:'',title:"Home"},{path:'recipe',title:"Recipe"},
        {path:'search',title:"Search"},{path:'contact',title:"Contact"}]

    let navigate=useNavigate();

      console.log('user:'+user);

async function logout(e) {
    //e.preventDefault();
      console.log("signout")
    const response = await fetch(import.meta.env.VITE_API_URL+"/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",
    });

    const data = await response.json();
    console.log("Réponse backend :", data);

    if (data.succeed) {
      setUser("")
       navigate("/"); // redirection SPA
  }
  }

 return( 
<>
  
 <nav className="navbar navbar-expand-sm navbar-white bg-white"> 
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="mynavbar">
      <ul className="navbar-nav  me-auto mb-3 mt-2  ">


        { pathTab.map((path,index)=>(   
            <li key={`nav ${index}`} className="nav-item  ">
              <NavLink to={`/${path.path}`}  className={({ isActive }) => "nav-link fs-5" + (isActive ? " urlActive" : "") }> {path.title}</NavLink>
        </li>     
        ))}
         
           {/* <li className="nav-item ">
             <NavLink to="/signin"className={({ isActive }) => "nav-link text-black fs-5  pb-1 mb-2 pb-lg-0 mb-lg-0 border-0 urlCustom2"
              + (isActive ? " urlActive" : "") }> Sign in</NavLink>
        </li> */}
      </ul>
      <form className="d-flex">
         <a className="nav-link fs-5 urlCustom" href="javascript:void(0)"></a>
       
      
    
      </form>    

    </div>
          <div className="rightNav">
          
           <SearchBarNav/>               
            {!user?(<>
            {/* <button type="button" className="btn btnAc fs-5 rounded-pill mx-2 btnCustom2 " id="signinButton"  >Sign in</button> */}
             <NavLink to="/signin" className={({ isActive }) => " pt-2 mx-2 nav-link fs-5" + (isActive ? " urlActive" : "") }>Sign in</NavLink>
            <button type="button" className="btn  btnAc btn-primary fs-5 rounded-pill mx-2 btnCustom " onClick={()=>setShowSignup(true)}  >Sign up</button>
            </>): ( <>  <NavLink to="/account" className={({ isActive }) => " pt-2 mx-2 nav-link fs-5" + (isActive ? " urlActive" : "") }>{user}</NavLink>
               
                <button type="button" onClick={()=>logout()} class="btn btn-primary bg-danger fs-5 rounded-pill mx-2 btnCustom " >Sign out</button>
                </>  )}

          
          </div>
  </div>
</nav>
{showSignup&&( <Signup  setShowSignup={setShowSignup} />)}

</>
 );}