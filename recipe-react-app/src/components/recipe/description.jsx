export default function Decription({title,img,description}){


    return(
        <div className="recipeTitle row gx-0">

  <div className="d-lg-flex container ">
        {/* <!--img--> */}
        <div className="col-lg-6">
        <div className=" justify-content-center  image-container">
        <img src={img} className=" tilt1  pt-3 rounded-5 recipePhoto" alt="image"/>
        </div>
          </div>
        {/* <!--description--> */}
    <div className="col-lg-6" >
    <div className=" pt-3 descriptionRecipe">
            {/* <!--title--> */}
    <h1 className="fade-in">{title}</h1>
    <p className="text-black-50  fs-4"> <a href={description} target="_blank" rel="noopener noreferrer">
       <i className="fa-brands fa-youtube fs-1"></i></a> </p>

    {/* <!--Recipe info--> */}
    <div className="d-flex text-center  descriptionLogos border-bottom">
        <div className="logo1  p-3 mx-2  m-lg-3 px-lg-5 text-center border-end">
       <i className="fa-regular fa-clock fs-3 rotatec"></i>
       <p className="m-0 p-0" >Active time</p>
        <p className="m-0 p-0 text-black-50 " id="activeTime"></p>
        </div>
        <div className="logo2  p-3 mx-2 m-lg-3 px-lg-5 text-center border-end">  
        <i className="fa-solid fa-clock-rotate-left fs-3 rotatec"></i>
        <p className="m-0 p-0" >Total time</p>
        <p className="m-0 p-0 text-black-50 " id="totalTime"></p>
        </div>
        <div className="logo3 p-3 mx-2 m-lg-3 px-lg-5 text-center">        
        <i className="fa-solid fa-users fs-3"></i>
        <p className="m-0 p-0" >Yield</p>
        <p className="m-0 p-0 text-black-50" id="yield"> Serves </p>
        </div>
    </div>


    <div className="d-flex mt-5 bottomDescription">
    
    <div className="container">
    <p className="m-0 p-0">Created by <span className="text-danger" id="author">Corentin CHAN</span> </p>
    <p className="m-0 p-0 text-black-50" id="nbRecipes">21recipes </p>
    </div>
    
       <div className="d-flex justify-content-center ">
         <i className="fa-regular fa-plus fs-3 mx-3 clickable"></i>
        <i className="fa-solid fa-cart-arrow-down fs-3 mx-3 clickable"></i>
        <i className="fa-solid fa-print fs-3 mx-3 clickable" id="print" onClick={window.print}></i>
    </div>
    </div>
    
         </div>


    </div>
  </div>
</div>

    );
}