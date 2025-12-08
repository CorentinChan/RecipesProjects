

export default function Profil({ user, userRole }) {
  return (
    <div>
                <button type="button" className=" bg-transparent border-0" data-bs-toggle="modal" data-bs-target="#passwordModal">
              
                  <div className="logo1  p-3  px-lg-3 align-items-center text-center border-end">
                    <i className="fa-solid fa-key fs-3"></i>
                    <p className="m-0 p-0">Change password</p>
                  </div>
              
                </button>
      {/* Modal */}
      <div className="modal fade mt-5" id="passwordModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modify your password</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="changePasswordForm">
              <div className="modal-body d-flex flex-column align-items-center">
                {/* current password */}
                <label className="form-label">Current password</label>
                <input type="password" className="form-control form-control-sm mb-5 p-2 w-75" minLength="8" name="passwordCurrent" placeholder="" />
                {/* new password */}
                <label className="form-label">New password</label>
                <input type="password" className="form-control form-control-sm mb-5 p-2 w-75" minLength="8" name="passwordNew" placeholder="" />
                {/* check password */}
                <label className="form-label">Retype password</label>
                <input type="password" className="form-control form-control-sm mb-5 p-2 w-75" minLength="8" name="passwordNew2" placeholder="" />
              </div>
            </form>
            <div id="responseMessage"></div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" id="changePasswordButton">Change password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
