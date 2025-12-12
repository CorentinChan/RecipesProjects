import {FacebookShareButton,FacebookIcon,TwitterShareButton,TwitterIcon,} from "react-share";
import { WhatsappShareButton, WhatsappIcon } from "react-share";


 
 
 export default function  Footer() {
const url = "https://corentinchan.de";
const title = "Découvrez de nombreuses recettes!";

function toggleTheme() {
  const html = document.documentElement;
  html.setAttribute( "data-bs-theme",html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark" );
}

 return( 
<footer>

<div className="justify-content-around">
  
{/* <button onClick={toggleTheme}>
  Dark / Light
</button> */}

  <div className="logos me-5 pe-lg-5">
    <div>
      <FacebookShareButton className="m-2" url={url} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton className="m-2" url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

         <WhatsappShareButton className="m-2" url={url} title={title} separator=":: ">
           <WhatsappIcon size={32} round />
         </WhatsappShareButton>
     
    </div>

  </div>
</div>

  <div className="container mt-3 table-perso">

      <ul>
        <li><a href="">Presentations</a></li>
        <li><a href="">Profesionals</a></li>
        <li><a href="">Stores</a></li>
      </ul>
              <ul>
         <li><a href="">Webinars      </a></li>
          <li ><a href="">Workshops</a></li>
         <li><a href="">Local Meetups</a></li>
      </ul>
        <ul>
         <li><a href="">Ours initiative</a></li>
          <li><a href="">Giving Back</a></li>
         <li><a href="">Communities</a></li>
      </ul>
        <ul>
        <li><a href="">Contact Form</a></li>
        <li><a href="">Work with us</a></li>
        <li><a href="">Visit us</a></li>
      </ul>
             

</div>

  <p className="textTab">Made by C.C</p> 


</footer>

 )}