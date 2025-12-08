 import SearchBarNav from './searchBarNav'
  import Signup from './signup'
  import { useState } from "react";

 import { NavLink } from 'react-router-dom';

 
 export default function  Nav({user}) {
  const [showSignup, setShowSignup] = useState(false);


 return( 
<>
  
 <nav className="navbar navbar-expand-sm navbar-white bg-white"> 
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="mynavbar">
      <ul className="navbar-nav  me-auto mb-3 mt-2  ">
          <li className="nav-item  ">
              <NavLink to="/home"className={({ isActive }) => "nav-link fs-5" + (isActive ? " urlActive" : "") }> Home</NavLink>
        </li>
        <li className="nav-item  ">
              <NavLink to="/recipe"className={({ isActive }) => "nav-link fs-5" + (isActive ? " urlActive" : "") }> Recipe</NavLink>
        </li>
        <li className="nav-item ">
              <NavLink to="/search"className={({ isActive }) => "nav-link fs-5" + (isActive ? " urlActive" : "") }> Search</NavLink>
        </li>
        <li className="nav-item">
              <NavLink to="/contact"className={({ isActive }) => "nav-link fs-5" + (isActive ? " urlActive" : "") }> Contact</NavLink>
        </li>
           <li className="nav-item ">
          <a className="nav-link text-black fs-5  pb-1 mb-2 pb-lg-0 mb-lg-0 border-0 urlCustom2">Sign in</a>
        </li>
      </ul>
      <form className="d-flex">
         <a className="nav-link fs-5 urlCustom" href="javascript:void(0)"></a>
       
      
    
      </form>    

    </div>
          <div className="rightNav">
          
           <SearchBarNav/>               
            {!user?(<>
            <button type="button" className="btn btnAc fs-5 rounded-pill mx-2 btnCustom2 " id="signinButton"  >Sign in</button>
            <button type="button" className="btn  btnAc btn-primary fs-5 rounded-pill mx-2 btnCustom " onClick={()=>setShowSignup(true)}  >Sign up</button>
            </>): ( <>  <NavLink to="/account" className={({ isActive }) => " pt-2 mx-2 nav-link fs-5" + (isActive ? " urlActive" : "") }>{user}</NavLink>
               <form action="logout" method="POST">
                <button type="submit" class="btn btn-primary bg-danger fs-5 rounded-pill mx-2 btnCustom " >Sign out</button>
                </form> </>  )}

          
          </div>
  </div>
</nav>
{showSignup&&( <Signup  setShowSignup={setShowSignup} />)}

</>
 );}