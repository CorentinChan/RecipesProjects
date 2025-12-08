import { useState,useEffect } from "react";
import React, { Fragment } from "react";


export default function Instructions({instructions}){
  const [instructionsTab, setInstructionsTab] = useState([]);

     useEffect(() => {
    
     let cleanInstructions = instructions
        .replace(/\r?\n\r?\n/g, "\n")  // remplace les doubles/triples sauts par un seul
        .trim();

    let splitInstructions=cleanInstructions.split(/\r?\n/);

    setInstructionsTab(splitInstructions);

      }, [instructions]);
    



    return(
 <div className="recipeSteps">
        <h2 className=" mt-5  my-lg-0">How to make it</h2>
    <ol className="mt-lg-4 list-group instructionsList"  >
               {instructionsTab&&
      instructionsTab.map((instruction,index) => (
    <React.Fragment key={index}>
      <li className="d-flex border-0">
        <i className="fa-regular fa-circle-check fs-2 me-3"></i>
        <h4 className="text-danger pt-1">{index + 1}.STEP</h4>
        <div className="container-fluid border-top m-3 me-5"></div>
      </li>

      <li className="list-group-item border-0 border-bottom-1 mx-5 text-black-50 fs-5">
        {instruction}
      </li>
    </React.Fragment>
              ))
        
            }
       
    </ol>
    </div>
    );
}