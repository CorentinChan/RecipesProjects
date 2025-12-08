import { useState } from "react";

export default function CreateRecipe() {
  const [steps, setSteps] = useState(Array(3).fill(null)); // initalise un tableau de 3 valleurs null
  const [ingredients, setIngredients] = useState(Array(2).fill(null));
  const [measures, setMeasures] = useState(Array(2).fill(null));
  const [tags, setTags] = useState([""]);

  const addStep = () => setSteps([...steps, ""]);
  const addIngredient = () => { setIngredients([...ingredients, ""]); setMeasures([...measures, ""]); }
  const addTag = () => setTags([...tags, ""]);

  const handleChange = (setter, index, value, stateTab) => {
    const newTab = [...stateTab]; newTab[index] = value; setter(newTab);
  };

  const handleSubmit = (e) => { e.preventDefault(); console.log({steps, ingredients, measures, tags}); };

  return (
    <form onSubmit={handleSubmit}>
      <section className="recipeTitle gx-0">
        <div className="container justify-content-center">
          <h3 className="m-5 p-3 text-center bg-danger rounded-4 text-white">Write your own recipe!</h3>
          <label className="form-label">Recipe Picture</label>
          <input className="form-control form-control-sm mb-5 p-2 w-75" type="text" placeholder="enter picture url" />
          <label className="form-label">Recipe Title</label>
          <input className="form-control form-control-sm mb-5 p-2 w-75" type="text" placeholder="enter title recipe" />
          <label className="form-label">Recipe Description</label>
          <input className="form-control form-control-sm mb-5 p-2 w-75" type="text" placeholder="enter description recipe" />

          <div className="d-flex text-center descriptionLogos border">
            <div className="logo1 p-2 mx-2 m-lg-3 px-lg-5 text-center border-end">
              <i className="fa-regular fa-clock fs-3 rotatec"></i>
              <input className="form-control form-control-sm" type="text" placeholder="enter active time" />
            </div>
            <div className="logo2 p-2 mx-2 m-lg-3 px-lg-5 text-center border-end">
              <i className="fa-solid fa-clock-rotate-left fs-3 rotatec"></i>
              <input className="form-control form-control-sm" type="text" placeholder="enter total time" />
            </div>
            <div className="logo3 p-2 mx-2 m-lg-3 px-lg-5 text-center">
              <i className="fa-solid fa-users fs-3"></i>
              <input className="form-control form-control-sm" type="text" placeholder="enter yield" />
            </div>
          </div>

          <div className="d-flex mt-5 bottomDescription">
            <div className="container">
              <label className="form-label">Recipe Author</label>
              <input className="form-control form-control-sm mb-5 p-2 w-75" type="text" placeholder="enter name author" />
            </div>
          </div>
        </div>
      </section>

      <section className="m-1 p-1 m-lg-5 p-lg-3 makeRecipe-container">
        <div className="recipeLeft">
          <div className="recipeSteps">
            <h2 className="mt-5 my-lg-0">How to make it</h2>
            <ol className="mt-lg-4 list-group instructionsList">
              {steps.map((step, i) => (
                <li key={i} className="list-group-item border-0 mb-2">
                  <div className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check fs-2 me-3"></i>
                    <h4 className="text-danger pt-1">STEP {i + 1}</h4>
                  </div>
                  <div className="border-top my-2"></div>
                  <input className="form-control form-control-sm m-2 p-2 w-75" type="text" placeholder={`write step ${i + 1}`} 
                  value={step} onChange={(e) => handleChange(setSteps, i, e.target.value, steps)} />
                </li>
              ))}
            </ol>
            <i className="fa-regular fa-plus fs-5 my-2 mx-3  clickable" onClick={addStep}><span className="">Add more steps</span></i>
          </div>
        </div>

        <div className="recipeRight">
          <div className="d-lg-flex mt-5 mt-lg-0 recipeIngredients">
            <div>
              <h2>Ingredients</h2>
              <ul className="list-group ingredientsList">
                {ingredients.map((ing, i) => (
                  <li key={i} className="mb-2">
                    <input className="form-control form-control-sm m-2 p-2 w-75" type="text" placeholder={`write ingredient ${i + 1}`} 
                    value={ing} onChange={(e) => handleChange(setIngredients, i, e.target.value, ingredients)} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Measure</h2>
              <ul className="list-group measureList">
                {measures.map((m, i) => (
                  <li key={i} className="mb-2">
                    <input className="form-control form-control-sm m-2 mb-3 p-2 w-75" type="text" placeholder={`write measure ${i + 1}`} 
                    value={m} onChange={(e) => handleChange(setMeasures, i, e.target.value, measures)} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

           <i className="fa-regular fa-plus  fs-5 my-2 mb-3  mx-3 clickable" onClick={addIngredient}><span className="">Add more ingredients</span></i>


          <div className="pt-3 mt-3">
            <h3>Tags</h3>
            <div className="dflex tags">
              {tags.map((tag, i) => (
                <input key={i} className="form-control form-control-sm m-2 p-2 w-75" type="text" placeholder={`write TAG ${i + 1}`} 
                value={tag} onChange={(e) => handleChange(setTags, i, e.target.value, tags)} />
              ))}
            </div>
            <i className="fa-regular fa-plus  fs-5 my-2 mb-3 mx-3 clickable" onClick={addTag}><span className="">Add more tags</span></i>
          </div>
        </div>
      </section>

      <div className="d-flex justify-content-center">
        <button type="submit" className="text-center btn btn-danger p-3 px-5 mb-5 fs-4 rounded-pill">Submit</button>
      </div>
    </form>
  );
}
