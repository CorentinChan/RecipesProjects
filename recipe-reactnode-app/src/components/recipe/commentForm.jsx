import favicon from '../images/favicon.png';

import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function CommentForm({recipeID,updateForm,setUpdateForm}){
const [message,setMessage]=useState([])

const navigate = useNavigate();

  const handleNote = (event) => {
   console.log(event.target.value);
    let note=event.target.value;
   async function fetchNote() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/giveNote",
          {
          note,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        console.log("Réponse backend tags :", data);
        console.log(data.succeed);
         setUpdateForm(prev => prev + 1);

 
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    console.log(recipeID);
    fetchNote();
    // let url="/recipe?id="+recipeID;
    // navigate(url+'#commentPart');

  }

  useEffect(() => {
  console.log("updateForm changed:", updateForm);
}, [updateForm]);


    function handleSubmit(e){
     e.preventDefault();
      let comment= message;
       async function fetchMessage() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/addComment",
          {
          comment,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        console.log(data.succeed);
        setUpdateForm(prev => prev + 1);

      } catch (error) {
        console.error("error axios :", error);
      }
    }
    fetchMessage();


    }

    return(
      <div className="list-group p-lg-3 noprint">
          <div className="list-group-item" aria-current="true">
            <div className=" d-flex w-100 justify-content-between">
              <div className="d-flex"><i className="fa-solid fa-star p-3"></i> 
              <select onChange={handleNote} className="form-select form2" defaultValue={""} >
  <option value="" disabled>Give a note</option>
       <option>1</option>
     <option>2</option>
     <option>3</option>
     <option>4</option>
      <option>5</option>
   </select>
            </div>
            </div>
            <form className="my-1 py-3" onSubmit={handleSubmit}>
    <div className=" ">
      <label htmlFor="comment">Comments:</label>
      <textarea className="form-control" rows="5" id="commentForm" name="text" onChange={(e)=>setMessage(e.target.value)} value=  {message}></textarea>
    </div>
    <button type="submit" className="btn mt-3 btn-primary ">Submit</button>
  </form>
          </div>
      </div>
      


    );
}