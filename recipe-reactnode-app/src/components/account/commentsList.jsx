  import { useState,useEffect } from "react";
  import axios from 'axios';
  import { useNavigate } from "react-router-dom";


export default function  CommentsList() {
const [comments,setComments]=useState([]);
const [notes,setNotes]=useState([]);
const navigate=useNavigate();

//use axios for fetch to backend to get comments writted by user connected
 async function getComments(){ 
          const response = await axios.get(import.meta.env.VITE_API_URL+"/getComments", {
          headers: {
            "Content-Type": "application/json",
          },
        withCredentials: true,    
             });
          const data = response.data;
        console.log("Réponse backend account:", data);
       setNotes(data.notes);
       setComments(data.comments);
    
            }

  useEffect(() => {             
          getComments();
      }, []);

      //use fetch to delete a comment from BDD
      async function commentSubmit(e){
        e.preventDefault();
        let recipeID=e.target.value;
        console.log(recipeID);

        try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/deleteComm",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        //setMessage(data.message);
        console.log("Réponse backend delete comm :", data);

        if (data.check) {
        getComments();
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         //setMessage(error.response?.data?.message || "Erreur réseau");
      }
      
      }

      //delete note from mysql BDD
      async function noteSubmit(e){
        e.preventDefault();
        let recipeID=e.target.value;
        console.log(recipeID);
        try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/deleteNote",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        //setMessage(data.message);
        console.log("Réponse backend delete own :", data);

        if (data.check) {
          getComments();
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
         //setMessage(error.response?.data?.message || "Erreur réseau");
      }
  

      }

return ( 
<div className="d-flex justify-content-center m-2 m-lg-5" id="comment"> 
  <div className="accordion accordion-flush bg-light w-75 w-sm-100 justify-content-center mt-3 text-center mx-2 me-4" id="accordionFlushExample">
    
    <div className="accordion-item text-center w-100">
      <h2 className="accordion-header" id="flush-headingOne">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseOne"
          aria-expanded="false"
          aria-controls="flush-collapseOne"
        >
          My Comments
        </button>
      </h2>
      <div
        id="flush-collapseOne"
        className="accordion-collapse collapse" // à gérer avec React state
        aria-labelledby="flush-headingOne"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <ul className="list-unstyled">
           { comments.map((comment,index)=>( 
            <li key={`comlist${index}`} className="d-lg-flex flex-column bg-warning-subtle mb-2 p-1 rounded-pill border">
              <p>{comment.title} : </p>
             <p>{comment.commentaire}</p>
                <button type="submit" className="rounded-5 bg-danger" 
                value={comment.recipeID} onClick={commentSubmit} >Delete</button>
            </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="accordion-item w-100">
      <h2 className="accordion-header" id="flush-headingTwo">
        <button
          className="accordion-button collapsed text-center"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseTwo"
          aria-expanded="false"
          aria-controls="flush-collapseTwo"
        >
          My notes
        </button>
      </h2>
      <div
        id="flush-collapseTwo"
        className="accordion-collapse collapse" // à gérer avec React state
        aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <ul className="list-unstyled">
          { notes.map((note,index)=>( 
            <li key={`notelist${index}`} className="d-flex flex-column  justify-content-center bg-warning-subtle mb-2 p-1 rounded-pill border">
              <p className="text-center me-1">{note.title}</p>
              <p>note : {note.note} / 5</p>
              <div>
                <button className="btn-danger bg-danger border-1 rounded-5 mx-2 mx-lg-5" 
                value={note.recipeID} type="button" onClick={noteSubmit}>Delete</button>
             </div>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>

  </div>
</div>


)
 }