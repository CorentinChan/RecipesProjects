import favicon from "../images/favicon.png";

export default function Commentaires() {
  return (
    <div className="comments mt-lg-5 pt-5  ">

      
      <h3>Comments</h3>

      <div className="list-group p-lg-3">
        <div className="list-group-item" aria-current="true">
          <div className=" w-100 justify-content-between">
            <div className="d-flex ">
              <img
                className="imageComm fs-1 mx-lg-0 me-2 me-lg-3 py-1   rounded-circle"
                src={favicon}
              />
              <div className="d-flex flex-column mt-2 mt-lg-3">
                <h5 className="mb-1">CHAN Corentin</h5>
                <small className="text-black-50">3 days ago</small>
                <div>
                  <span className="">
                    <i className="fa-solid fa-star"> </i>{" "}
                    <i className="fa-solid fa-star"> </i>{" "}
                    <i className="fa-solid fa-star"> </i>{" "}
                    <i className="fa-solid fa-star"> </i>
                    <i className="fa-regular fa-star"></i>
                  </span>
                </div>
              </div>{" "}
            </div>

            <p className="my-1 py-3">
              Ce plat est vraiment bon et riche en patate
            </p>
          </div>
        </div>
      </div>

      <div className="list-group p-lg-3 com-container2">
        <div className="list-group-item  bg-danger-subtle" aria-current="true">
          <div className=" w-100 justify-content-between">
            <div className="d-flex ">
              <img
                className="imageComm fs-1 mx-lg-0 me-2 me-lg-3 py-1   rounded-circle"
                src={favicon}
              />
              <div className="d-flex flex-column mt-2 mt-lg-3">
                <h5 className="mb-1">CHAN Corentin</h5>
                <small className="text-black-50">3 days ago</small>
                <div>
                  <span className="">
                    <i className="fa-solid fa-star"> </i>{" "}
                    <i className="fa-solid fa-star"> </i>
                    <i className="fa-solid fa-star"> </i>{" "}
                    <i className="fa-solid fa-star"> </i>
                    <i className="fa-regular fa-star"></i>
                  </span>
                </div>
              </div>{" "}
            </div>

            <p className="my-1 py-3">
              Ce plat est vraiment bon et riche en patate
            </p>
          </div>
        </div>
      </div>

      <div className="list-group p-lg-3">
        <div className="list-group-item" aria-current="true">
          <div className=" d-flex w-100 justify-content-between">
            <div className="d-flex">
              <i className="fa-solid fa-star p-3"></i>{" "}
              <select className="form-select form2">
                <option selected disabled>
                  Give a note
                </option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
          </div>
          <form className="my-1 py-3" action="">
            <div className=" ">
              <label htmlFor="comment">Comments:</label>
              <textarea
                className="form-control"
                rows="5"
                id="commentForm"
                name="text"
              ></textarea>
            </div>
            <button type="submit" className="btn mt-3 btn-primary ">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
