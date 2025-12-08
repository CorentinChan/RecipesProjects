 export default function  Subscribe() {

return ( 
  <div className="subscribeSection">

        <div className="container p-2 p-lg-5 border rounded-4 shadow-sm bg-danger mx-2 w-lg-100 ">

          <h4 className="mx-0 py-2 px-0 mx-lg-5 px-lg-5 text-white text-center">
            Be the first to know about the latest deal, receive new trending recipes & more
          </h4>

    <form className="d-flex   content-center ">
      <div className=" d-lg-flex w-100 w-lg-75 mx-auto">

              <input type="text" className="form-control rounded-pill bg-danger border border-white text-white"  id="mail"
                placeholder="e-mail address" />

              <button  type="button"  className="btn mx-3 fs-5 px-3 rounded-pill"  >
                Subscribe
              </button>

            </div>
          </form>
        </div>
      </div>
)
 }