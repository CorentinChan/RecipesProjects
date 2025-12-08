import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
 export default function  CardUser({title,img,id}) {
 let url ='/recipe?id='+id;
  let navigate = useNavigate();
.0


 return( 

          <div  className="card shadow-sm h-100  "  data-testid={`card-${id}`} onClick={()=>{navigate(url)}} >

            <img src={img} className="card-img-top" alt="recipe img" />
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <div className="d-flex justify-content-between"> 
                <span>note<i className="pb-1 ms-1 fa-solid fa-star"></i></span>
                <span className="card-text">auteur</span>
              </div>
            </div>         

      </div>

        )}