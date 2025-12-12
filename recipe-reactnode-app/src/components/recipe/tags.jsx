import { useState,useEffect } from "react";
import axios from 'axios';

export default function Tags({recipeID}){
  const [tagsTab, setTagsTab] = useState([]);
 

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getTags",
          {
            recipeID,
          },
          {
            headers: {"Content-Type": "application/json",},
            withCredentials: true,
          }
        );
        setTagsTab(data.tags);
        console.log("Réponse backend tags :", data);
        console.log(data.tags);

 
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    console.log(recipeID);
    fetchTags();
  }, [recipeID]);

    return(
        <>
 <div className=" pt-3 mt-3">
      <h3 >Tags</h3>
      <div className="tags">
        {tagsTab&&
      tagsTab.map((tag,index) => (
      <span key={index} className="badge text-bg-primary m-2 fs-5">{tag.tag}</span>
              ))
            }
      </div>  

    </div>

    {/* <div className="shareRecipe pt-3 mt-3">
      <h3 >Share recipes</h3>
  <div className="d-flex justify-content-center me-5 pe-lg-5">
<i className="fa-brands fa-facebook fa-2x p-3" ></i>
<i className="fa-brands fa-instagram fa-2x p-3"></i>
<i className="fa-brands fa-twitter fa-2x p-3"></i>

  </div>
    </div> */}
    
</>
    );
}