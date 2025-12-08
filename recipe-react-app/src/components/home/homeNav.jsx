 export default function  HomeNav({keyword,setKeyword}) {

return ( 
  
    <div className="recipeMenu">
      <h1 className="ms-2"> Recipes</h1>
      
    <div className="container mt-3 ">

     <div className="accordion" id="menuAccordion">

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true">
          Dishes
        </button>
      </h2>
      <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#menuAccordion">
        <div className="accordion-body">
          <a className="textSearchMenu" onClick={()=>setKeyword('breakfast')}>Breakfast</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('pasta')}>Pasta</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('beef')}>Beef</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('chicken')}>Chicken</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('seafood')}>Sea Food</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('side')}>Side</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('dessert')}>Dessert</a>


        </div>
      </div>
    </div>

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false">
         World Food
        </button>
      </h2>
      <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#menuAccordion">
        <div className="accordion-body">
          <a className="textSearchMenu" onClick={()=>setKeyword('chinese')}>Chinese</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('Turkish')}>Turkish</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('Indian')}>Indian</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('Thai')}>Thai</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('Moroccan')}>Moroccan</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('Mexican')}>Mexican</a>
          <a className="textSearchMenu" onClick={()=>setKeyword('japanese')}>Japanese</a>

        </div>
      </div>
    </div>

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false">Others
        </button>
      </h2>
      <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#menuAccordion">
        <div className="accordion-body">
           <a className="textSearchMenu" onClick={()=>setKeyword('vegan')}>Vegan</a>
           <a className="textSearchMenu" onClick={()=>setKeyword('Vegetarian')}>Vegetarian</a>
        </div>
      </div>
    </div>

  </div>



    </div>
</div>
)
 }