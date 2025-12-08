  import CardUser from '../cardUser'
  import imgCard from '../images/background1.png'


export default function  OwnRecipes() {

return ( 
   <div className="videoSection2 bg-light container-fluid py-5" id="fav">
  
    <div className="videoTitle m-3 m-lg-5 justify-content-center">
      <h2 className="bg-danger-subtle text-danger border rounded-pill p-2">
        Your favorites recipes
      </h2>
    </div>
  
    <div className="videos-container2 m-lg-5 flex-nowrap" id="videos-container">
    
      <div className="cardExt">
        <CardUser img= {imgCard}/>
        <div class="d-flex justify-content-around mt-1">
        <form method="post" action="modifyForm?recipe=<%=recipe.id%>">
          <button class="btn  text-center rounded-pill mx-1 bg-primary border border-black" name="modifyOwn" value="recipe.id">Modify</button></form>
          <form method="post" action="deleteOwn">
          <button class="btn  text-center rounded-pill mx-1 bg-danger border border-black" name="deleteOwn" value="recipe.id">Delete</button></form>
        </div>
      </div>     
  
    </div>
  
  </div>
  
)
 }