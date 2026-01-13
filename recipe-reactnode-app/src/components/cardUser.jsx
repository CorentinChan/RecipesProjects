import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Link } from 'react-router-dom';
 
 export default function  CardUser({title,img,id,note,author}) {
 let url ='/recipe?id='+id;
  let navigate = useNavigate();

 return( 
  // card
          <div  className="card shadow-sm h-100 m-2 z-10  " key={id} > 
                      <Link className="text-decoration-none text-reset" to={url} state={{ scrollTop: Date.now() }}>
                   {/* image card */}           
            <img 
              loading="lazy" 
              width="300" 
              height="300"
              decoding="async"  
            src={img?img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAdnj607fkyztZ3TkKVTdEy-FG-tD-gEGJQ&s"}  className="card-img-top" alt="Card 1"/>

                  {/* description card */}
            <div  className="card-body">
              <h5  className="card-title"> {title} </h5>
              <div className="d-flex mt-5 justify-content-between"> 
                <span>{note}<i className="pb-1  ms-1 fa-solid fa-star"></i></span>
                <span className="card-text">{author}</span>
              </div>
            </div>         
</Link>

      </div>
        )}