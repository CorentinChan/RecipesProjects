import { useState } from 'react'
import './App.css'
import './styleResp.css'
import './animation.css'


import Home from '/src/pages/home.jsx'
import Contact from '/src/pages/contact.jsx'
import Recipe from '/src/pages/recipe.jsx'
import Search from '/src/pages/search.jsx'
import Account from '/src/pages/account.jsx'
import Signin from '/src/components/signin.jsx'


import Nav from '/src/components/nav.jsx'
 import Footer from '/src/components/footer.jsx'


import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';



function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("admin");


  return (
    <>
         <BrowserRouter basename="/RecipeReact/">
    
      <Nav user={user}/>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/recipe" element={<Recipe user={user} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account user={user} userRole={userRole} />} />
        {!user?<Route path="/signin" element={<Signin />} /> : <Route path="/signin" element={<p class='text-center'>Not available</p>} /> }


      </Routes>
    </BrowserRouter>

          <Footer/>

    </>
  )
}

export default App
