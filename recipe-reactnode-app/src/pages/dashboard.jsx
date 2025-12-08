import { Outlet, Link } from "react-router-dom";

import Nav from '/src/components/nav.jsx'
import Footer from '/src/components/footer.jsx'

export default function Dashboard() {
  return (
    <div>
    <Nav />
      <Outlet />
    <Footer/>

    </div>
  );
}
