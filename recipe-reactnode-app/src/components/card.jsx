import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { useState,useEffect } from 'react'

 export default function  Card({title,img,id,note,author,isFavoris}) {
 const [favoris,setFavoris]=useState(isFavoris);
 let url ='/recipe?id='+id;
  let navigate = useNavigate();
  const user = useStore((state) => state.user);

  async function addFav(){
     e.stopPropagation();
    console.log(favoris);
    setFavoris(!favoris);
  }

 return( 

        <div  className="col-6 col-lg-4 px-1 my-lg-3 "       data-testid={`card-${id}`} 
        onClick={()=>{navigate(url);window.scrollTo({ top: 0, behavior: 'smooth' });}}>
          <div  className="card shadow-sm h-100  border-0 rounded-4  " key={id}>
            <div className="imagePart rounded-4 ">
            <img src={img?img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAdnj607fkyztZ3TkKVTdEy-FG-tD-gEGJQ&s"}  className="card-img-top border-0 rounded-4" alt="Card 1"/>
                { user&& <span className="heart-icon">
            <i className={`${favoris?"fa-solid":"fa-regular"} fa-heart fs-1`} onClick={addFav}></i>
                 </span>}
           </div>
            <div  className="card-body">
              <h5  className="card-title fw-bold"> {title} </h5>
              <div className="d-flex mt-5 justify-content-between"> 
                <span>{note}<i className="pb-1  ms-1 fa-solid fa-star"></i></span>
                <span className="card-text fst-italic">{author}</span>
              </div>
             </div>
          </div>
        </div>

        )}