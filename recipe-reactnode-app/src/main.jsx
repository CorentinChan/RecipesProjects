import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import {Helmet} from "react-helmet";


createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD

    <App />
=======
      <HelmetProvider>

    <App />
        </HelmetProvider>
>>>>>>> bc7382e0f0deb149ba776641a81b135f5f1a14fd

  </StrictMode>,
)
