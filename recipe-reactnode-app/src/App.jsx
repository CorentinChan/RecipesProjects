import { useState,useEffect } from 'react'
import './App.css'
import './styleResp.css'
import './animation.css'

import Dashboard from '/src/pages/dashboard.jsx'

// import Home from '/src/pages/home.jsx'
// import Contact from '/src/pages/contact.jsx'
// import Recipe from '/src/pages/recipe.jsx'
// import Search from '/src/pages/search.jsx'
// import Account from '/src/pages/account.jsx'
// import Signin from '/src/components/signin.jsx'


import { useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useStore } from "./store/store";
import ModifyRecipe from './components/modifyRecipe'
import LocationState from './components/locationState'
import React, { Suspense, lazy } from 'react';

// with lazy page will load only if needed
const Home = lazy(() => import('/src/pages/home.jsx'));
const Contact = lazy(() => import('/src/pages/contact.jsx'));
const Search = lazy(() => import('/src/pages/search.jsx'));
const Recipe = lazy(() => import('/src/pages/recipe.jsx'));
const Account = lazy(() => import('/src/pages/account.jsx'));
const Signin = lazy(() => import('/src/components/signin.jsx'));


function App() {
  const [count, setCount] = useState(0);
  //const [user, setUser] = useState("");
    const userRole = useStore((state) => state.userRole);
   const setUserRole = useStore((state) => state.setUserRole)
      const [locationState, setLocationState] = useState(0);

    const user = useStore((state) => state.user);
   const setUser = useStore((state) => state.setUser)



  return (
    <>
         <BrowserRouter basename="/">
       <LocationState user={user} setUser={setUser} userRole={userRole} setUserRole={setUserRole} locationState={locationState} 
       setLocationState={setLocationState} /> 

      {/* Routes */}
            {/* fallback display when download */}
          <Suspense fallback={<div className="container mt-5">loading...</div>}>
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
     </Suspense>

    </BrowserRouter>


    </>
  )
}

export default App
