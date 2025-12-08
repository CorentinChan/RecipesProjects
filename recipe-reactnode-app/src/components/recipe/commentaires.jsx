import favicon from '../images/favicon.png';

import { createContext, useState, useEffect } from "react";
import axios from 'axios';


export default function Commentaires({recipeID,udpateForm}){
const [comments,setComments]=useState([])

async function fetchComment() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getComment",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        setComments(data.comment);
        console.log("Réponse backend comm :", data);

 
      } catch (error) {
        console.error("error axios :", error);
      }
    }

    useEffect(() => {
      console.log(recipeID);
    fetchComment();
  }, [recipeID]);

      useEffect(() => {
    fetchComment();
  }, [udpateForm]);

    return(
 <div className="comments mt-lg-5 pt-5 id='commentPart'  ">
      <h3>Comments</h3>

   {comments&&
      comments.map((comment,index) => (
 <div className="list-group p-lg-3">
          <div className="list-group-item" aria-current="true">
            <div className=" w-100 justify-content-between">

              <div className="d-flex ">

              <img className="imageComm fs-1 mx-lg-0 me-2 me-lg-3 py-1   rounded-circle" src={comment.image}/>
               
               <div className="d-flex flex-column mt-2 mt-lg-3">
              <h5 className="mb-1">{comment.pseudo}</h5>
              <small className="text-black-50">{comment.date}</small>
              <div> <span className="">
                { comment.note&&[...Array(5)].map((_, i) => (
                      comment.note > i ? (
                        <i key={i} className="fa-solid fa-star"></i>
                      ) : (
                        <i key={i} className="fa-regular fa-star"></i>
                      )
                    ))}

                </span></div>
            </div>          
            </div>

            <p className="my-1 py-3">{comment.commentaire}</p>
      </div>
        </div>
      </div>

              ))
            }

     


      <div className="list-group p-lg-3 com-container2" >
          <div className="list-group-item  bg-danger-subtle" aria-current="true">
            <div className=" w-100 justify-content-between">
                <div className="d-flex ">

              <img className="imageComm fs-1 mx-lg-0 me-2 me-lg-3 py-1   rounded-circle" src={favicon}/>
               
               <div className="d-flex flex-column mt-2 mt-lg-3">
              <h5 className="mb-1">CHAN Corentin</h5>
              <small className="text-black-50">3 days ago</small>
              <div><span className=""><i className="fa-solid fa-star">  </i> <i className="fa-solid fa-star">  </i> 
              <i className="fa-solid fa-star">  </i> <i className="fa-solid fa-star">  </i>
              <i className="fa-regular fa-star"></i></span></div>
            </div>          </div>

            <p className="my-1 py-3">Ce plat est vraiment bon et riche en patate</p>
      </div>
        </div>
      </div>
  
 


      

    </div>

    );
}