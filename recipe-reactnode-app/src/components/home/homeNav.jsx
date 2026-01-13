 export default function  HomeNav({keyword,setKeyword}) {

return ( 
  
    <div className="recipeMenu my-4">
      <h2 className="ms-4 "> Recipes</h2>
      
    <div className="container mt-3 ">

     <div className="accordion" id="menuAccordion">

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button bg-light fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true">
          Dishes
        </button>
      </h2>
      <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#menuAccordion">
        <div className="accordion-body">
          <div className="textSearchMenu" onClick={()=>setKeyword('breakfast')}>Breakfast</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('pasta')}>Pasta</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('beef')}>Beef</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('chicken')}>Chicken</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('seafood')}>Sea Food</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('side')}>Side</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('dessert')}>Dessert</div>


        </div>
      </div>
    </div>

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button bg-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false">
         World Food
        </button>
      </h2>
      <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#menuAccordion">
        <div className="accordion-body flex-column">
          <div className="textSearchMenu" onClick={()=>setKeyword('chinese')}>Chinese</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('Turkish')}>Turkish</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('Indian')}>Indian</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('Thai')}>Thai</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('Moroccan')}>Moroccan</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('Mexican')}>Mexican</div>
          <div className="textSearchMenu" onClick={()=>setKeyword('japanese')}>Japanese</div>

        </div>
      </div>
    </div>

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button bg-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false">Others
        </button>
      </h2>
      <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#menuAccordion">
        <div className="accordion-body">
           <div className="textSearchMenu" onClick={()=>setKeyword('vegan')}>Vegan</div>
           <div className="textSearchMenu" onClick={()=>setKeyword('Vegetarian')}>Vegetarian</div>
        </div>
      </div>
    </div>

  </div>



    </div>
</div>
)
 }