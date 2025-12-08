import { useState,useEffect } from "react";

export default function Tags({tags}){
  const [tagsTab, setTagsTab] = useState([]);
 useEffect(() => {
  console.log("tags : " + tags);
    if(tags) {setTagsTab(tags.split(","));  }
      console.log("tagstab : " + tagsTab);

    }, [tags]);

    return(
        <>
 <div className=" pt-3 mt-3">
      <h3 >Tags</h3>
      <div className="tags">
        {tagsTab&&
      tagsTab.map((tag,index) => (
      <span key={index} className="badge text-bg-primary m-2 fs-5">{tag}</span>
              ))
            }
      </div>  

    </div>

    <div className="shareRecipe pt-3 mt-3">
      <h3 >Share recipes</h3>
  <div className="d-flex justify-content-center me-5 pe-lg-5">
<i className="fa-brands fa-facebook fa-2x p-3" ></i>
<i className="fa-brands fa-instagram fa-2x p-3"></i>
<i className="fa-brands fa-twitter fa-2x p-3"></i>

  </div>
    </div>
    
</>
    );
}