import { useState, useEffect } from "react";
import React, { Fragment } from "react";
import axios from "axios";

export default function Instructions({ recipeID }) {
  const [instructionsTab, setInstructionsTab] = useState([]);

  useEffect(() => {
    //gets steps data via axios
    async function fetchInstructions() {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/getSteps",
          { recipeID },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setInstructionsTab(data.instructions);
        console.log("Réponse backend :", data);
      } catch (error) {
        console.error("error axios :", error);
      }
    }
    console.log(recipeID);
    fetchInstructions();
  }, [recipeID]);

  return (
    <div className="recipeSteps">
      <h2 className=" mt-5  my-lg-0">How to make it</h2>
      <ol className="mt-lg-4 list-group instructionsList">
        {/* display all intructions */}
        {instructionsTab &&
          instructionsTab.map((instruction, index) => (
            <React.Fragment key={index}>
              {" "}
              {/* fragment beacause  li element */}
              <li className="d-flex border-0">
                <i className="fa-regular fa-circle-check fs-2 me-3"></i>
                <h4 className="text-danger pt-1">{index + 1}.STEP</h4>
                <div className="container-fluid border-top m-3 me-5"></div>
              </li>
              <li className="list-group-item border-0 border-bottom-1 mx-5 text-black-50 fs-5">
                {instruction.instruction}
              </li>
            </React.Fragment>
          ))}
      </ol>
    </div>
  );
}
