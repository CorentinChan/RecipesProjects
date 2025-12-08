export default function ModalProfil({ user }) {

  function submitFct(e) {
    e.preventDefault();
    console.log("Submit OK");
  }

  return (
    <>
      <button
        type="button"
        className="bg-transparent border-0 p-0 m-0"
        data-bs-toggle="modal"
        data-bs-target="#profilModal"
      >
        <div className="logo3 p-3 px-4 px-lg-5 text-center border-end">
          <i className="fa-solid fa-users fs-3"></i>
          <p className="m-0 p-0">Modify profil</p>
        </div>
      </button>




        <div className="modal fade mt-5" id="profilModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <form onSubmit={submitFct}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Modify Profil</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div className="modal-body d-flex flex-column align-items-center">
          <label htmlFor="pseudo" className="form-label">Pseudo</label>
          <input className="form-control form-control-sm mb-5 p-2 w-75" type="text" placeholder="" name="pseudo" />

          <label htmlFor="image" className="form-label">Your Picture</label>
          <input className="form-control form-control-sm mb-5 p-2 w-100" type="text" placeholder="" name="image" />

          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control mb-5 p-2 w-100" placeholder="description" name="description"></textarea>

          <p className="text-center text-info">message error</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</div>



            

     </>
  );
}
