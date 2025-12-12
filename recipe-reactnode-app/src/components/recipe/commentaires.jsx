import favicon from '../images/favicon.png';
import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import axios from 'axios';


export default function Commentaires({recipeID,udpateForm,userRole}){
const [comments,setComments]=useState([])
const navigate=useNavigate();



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

  async function deleteCom(e){
    e.preventDefault();
    const recipeID= e.target.recipeID.value;
    const pseudoID = e.target.pseudoID.value;

    try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/deleteCommAdmin",
          {
            recipeID,pseudoID
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        console.log("Réponse backend comm :", data);
        if(data.check) fetchComment();
 
      } catch (error) {
        console.error("error axios :", error);
      }


  }

    return(
 <div className="comments mt-lg-5 pt-5 noprint" id='commentPart'   >
      <h3>Comments</h3>

   {comments&& comments.map((comment,index) => (

 <div key={comment.index} className={index%2?"list-group p-lg-3 com-container2": "list-group p-lg-3"}>

          <div className= {index%2?'list-group-item  bg-danger-subtle':'list-group-item '} aria-current="true">

            <div className=" w-100 justify-content-between">

              <div className="d-flex ">

              <img className="imageComm fs-1 mx-lg-0 me-2 me-lg-3 py-1   rounded-circle" 
              src={comment.image?comment.image:'https://picsum.photos/400/250?random=1'}/>
               
               <div className="d-flex flex-column mt-2 mt-lg-3">
              <h5 className="mb-1">{comment.pseudo}</h5> 
              {userRole==="admin"&&(<p>id : {comment.userID} , {comment.mail} </p>) }
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

        {  userRole==="admin"&&(
                      <form class="justify-content-center" method="post" onSubmit={deleteCom}>
                      <button type="submit" class="btn bg-danger text-center rounded-pill border-black border-1" >Delete comment</button>
                      <input hidden name="pseudoID" value={comment.userID } />
                      <input hidden name="recipeID" value={recipeID} />
                      </form>     
                        )}
        </div>
      </div>

              ))
            }
      
     


      

    </div>

    );
}