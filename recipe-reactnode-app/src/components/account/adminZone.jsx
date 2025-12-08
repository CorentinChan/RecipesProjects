 export default function  AdminZone() {

return ( 
<div class=" container-fluid  py-5   " >

  <div class="videoTitle m-3 m-lg-5 justify-content-center">
  <h2 class=" bg-danger-subtle text-danger border rounded-pill p-2 ">Admin Zone</h2>
</div>

      <div class="d-flex  flex-column flex-lg-row justify-content-around">
          <div class="mb-4">
                <h3>BAN/UNBAN User :</h3>
                <form method="post" action="ban">
                  <input type="text" placeholder="enter pseudo name " minlength="4" name="pseudo"/> 
                  <button type="submit" class="btn-warning bg-warning" name="act" value="ban">BAN</button>
                  <button type="submit" class="btn-warning bg-primary" name="act" value="unban">UNBAN</button>
                </form>
              </div>

                <div class="mb-4">
                  <h3>Give Admin Right :</h3>
                <form method="post" action="giveAdmin">
                  <input type="text" placeholder="enter pseudo name" minlength="4" name="pseudo"/> 
                  <button type="submit" class="btn-warning bg-primary" name="act" value="giveAdmin">Give</button>
                  <button type="submit" class="btn-warning bg-warning" name="act" value="removeAdmin">Remove</button>
                </form>
                </div>

                             <div class="mb-4">
                  <h3>Modify or delete recipe by ID</h3>
                <form method="post" >
                  <input type="text" placeholder="enter recipe ID" name="recipeID" id="modifyrecipeForm"/> 
                  <button type="submit" class="btn-warning bg-primary"  formaction="/premodifyRecipe" name="act" value="Modify">Modify</button>
                  <button type="submit" class="btn-warning bg-warning" formaction="/deleteRecipe" name="act" value="remove">Remove</button>
                </form>
                </div>

                         
      </div>

</div>
)
 }