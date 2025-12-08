 export default function  CommentsList() {

return ( 
<div className="d-flex justify-content-center m-2 m-lg-5" id="comment"> 
  <div className="accordion accordion-flush bg-light w-75 w-sm-100 justify-content-center mt-3 text-center mx-2 me-4" id="accordionFlushExample">
    
    <div className="accordion-item text-center w-100">
      <h2 className="accordion-header" id="flush-headingOne">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseOne"
          aria-expanded="false"
          aria-controls="flush-collapseOne"
        >
          My Comments
        </button>
      </h2>
      <div
        id="flush-collapseOne"
        className="accordion-collapse collapse" // à gérer avec React state
        aria-labelledby="flush-headingOne"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <ul className="list-unstyled">
            <li className="d-lg-flex flex-column bg-warning-subtle mb-2 p-1 rounded-pill border">
              <p>titre comm</p>
              <p>commentaire</p>
              <form method="post" action="deleteComm">
                <input type="hidden" name="recipeIDComm" value="" />
                <button type="submit" className="rounded-5 bg-danger">Delete</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="accordion-item w-100">
      <h2 className="accordion-header" id="flush-headingTwo">
        <button
          className="accordion-button collapsed text-center"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseTwo"
          aria-expanded="false"
          aria-controls="flush-collapseTwo"
        >
          My notes
        </button>
      </h2>
      <div
        id="flush-collapseTwo"
        className="accordion-collapse collapse" // à gérer avec React state
        aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <ul className="list-unstyled">
            <li className="d-flex justify-content-center bg-warning-subtle mb-2 p-1 rounded-pill border">
              <p className="text-center me-1"></p>
              <p>note / 5</p>
              <form method="post" action="deleteNote">
                <input type="hidden" name="recipeIDnote" value="recipeID" />
                <button className="btn-danger bg-danger border-1 rounded-5 mx-2 mx-lg-5" type="submit">Delete</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</div>


)
 }