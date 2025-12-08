export default function Signup({setShowSignup}) {

function overlayClick() {
setShowSignup(false);
}

  return (
<div class="overlay" id="overlay2" onClick={overlayClick}>
    <div className="container signup"   >
      
      <button
        type="button"
        className="btn btnAc text-center btn-danger border p-1 btnClose2"
        aria-label="Close"
        onClick={()=>setShowSignup(false)}    >
        X
      </button>

      <div className="p-4 bg-danger border text-white rounded-5" onClick={(e) => e.stopPropagation()}>

        <form className="contactForm">
          <div className="mx-auto text-center text-grey formAlign">

            <h2 className="text-center m-3 fw-bold pt-2">Sign up</h2>

            <a href="/signin" className="text-center m-3">
              Have already an account? Click here to connect!
            </a>

            <h5 className="text-center m-3">
              Join us and add your own recipes and many more!
            </h5>

            {/* Email */}
            <label htmlFor="signupMail" className="form-label text-grey fs-4 me-3">
              Email
            </label>
            <input
              type="text"
              className="form-control rounded-pill text-black bg-white border border-grey text-center"
              id="signupMail"
              placeholder="tom@company.com"
            />

            {/* Pseudo */}
            <label htmlFor="signupPseudo" className="form-label text-grey fs-4 me-3 mt-3">
              Pseudo
            </label>
            <input
              type="text"
              className="form-control text-center text-black w-50 rounded-pill bg-white border border-grey"
              id="signupPseudo"
              placeholder="JohnDoe"
            />

            {/* Password */}
            <label htmlFor="signupPassword" className="form-label fs-4 me-3 mt-3">
              Password
            </label>
            <input
              type="password"
              className="form-control text-center text-black w-50 rounded-pill bg-white border border-grey"
              id="signupPassword"
              placeholder="Min 8 characters"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btnAc mx-3 fs-5 px-3 mt-3 btn-warning rounded-pill">
              Sign up!
            </button>
          </div>

        </form>

      </div>
    </div>
</div>
  );
}
