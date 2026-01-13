import { useState,useEffect } from "react";
import axios from 'axios';

export default function Tags({recipeID}){
  const [tagsTab, setTagsTab] = useState([]);
 
// get tags via axios and display
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

    
    
</>
    );
}