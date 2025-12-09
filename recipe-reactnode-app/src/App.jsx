import { useState,useEffect } from 'react'
import './App.css'
import './styleResp.css'
import './animation.css'

import Dashboard from '/src/pages/dashboard.jsx'

import Home from '/src/pages/home.jsx'
import Contact from '/src/pages/contact.jsx'
import Recipe from '/src/pages/recipe.jsx'
import Search from '/src/pages/search.jsx'
import Account from '/src/pages/account.jsx'
import Signin from '/src/components/signin.jsx'


import Nav from '/src/components/nav.jsx'
import Footer from '/src/components/footer.jsx'

import { useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useStore } from "./store/store";
import ModifyRecipe from './components/modifyRecipe'


function App() {
  const [count, setCount] = useState(0);
  //const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const user = useStore((state) => state.user);
   const setUser = useStore((state) => state.setUser)
  const location=useLocation();

      useEffect(() => {
            
    console.log("API" + import.meta.env.VITE_API_URL);

     async function getPseudo(){ 
      const response = await fetch(import.meta.env.VITE_API_URL+"/getPseudo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

         });

    const data = await response.json();
    console.log("Réponse backend :", data);
        setUser(data.pseudo);
        setUserRole(data.role);

        }
      getPseudo();
  }, [location.pathname]);

  return (
    <>
         <BrowserRouter basename="/">
    

      {/* Routes */}
    
      <Routes>
        <Route  element={<Dashboard />}>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/recipe" element={<Recipe user={user} userRole={userRole} key={Date.now()}  />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<Signin user={user} />} />
        <Route path="/account" element={<Account user={user} userRole={userRole} />} />
        <Route path="/modifyRecipe" element={<ModifyRecipe user={user} userRole={userRole} />} />

        {!user?<Route path="/signin" element={<Signin />} /> : <Route path="/signin" element={<p class='text-center'>Not available</p>} /> }
      </Route>


      </Routes>
    </BrowserRouter>


    </>
  )
}

export default App
