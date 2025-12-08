import { useState } from "react";

export default function Signin() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="d-lg-flex contactGroup">

      {/* SIGN IN SECTION */}
      
          <div className="contactForm-container p-lg-5">
            <div className="container">
              <div className="p-4 bg-white">
                <form className="contactForm">
                  <div className="w-100 w-lg-75 mx-auto text-center text-grey">
                    <h2 className="text-center m-4 text-black fw-bold pt-5">Sign in</h2>

                    <div className="logosLogin text-center d-flex justify-content-center">
                      <i className="fa-brands fa-facebook fa-2x p-3"></i>
                      <i className="fa-brands fa-instagram fa-2x p-3"></i>
                      <i className="fa-brands fa-twitter fa-2x p-3"></i>
                    </div>

                    <h5 className="text-center m-4 text-grey">Or use your email account :</h5>

                    <label htmlFor="mail" className="form-label text-center text-grey fs-4 me-3">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill bg-white border border-grey text-center"
                      id="mail"
                      placeholder="tom@company.com"
                    />


                    <label htmlFor="password" className="form-label fs-4 me-3 mt-3">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-pill bg-white border border-grey text-center"
                      id="password"
                      placeholder="Min 8 characters"
                    />
                  </div>

                  <div className="text-center my-3">
                    <a href="">forget your password?</a>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn mx-3 fs-5 px-3 mt-3 btn-warning rounded-pill">
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* OPEN SIGN UP */}
          {!showSignup && (
        <>
          <div className="signupSection py-3">
            <div className="container py-5">
              <div className="p-4 border rounded-4 shadow-sm text-white text-center background-perso">
                <div className="addMargin">
                  <h2 className="m-3 p-3 fw-bold">Hello there, join us</h2>
                  <h5 className="m-3 p-3">Enter your personal details, and join the cooking community</h5>

                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="btn fs-5 p-3 m-3 bg-white rounded-pill"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

        </>
      )}

      {/* SIGN UP SECTION */}
      {showSignup && (<>
        <div className="container signup2 mt-5 text-white">
          <div className="p-4 bg-danger rounded-5 my-5">
            <form className="contactForm">
              <div className="mx-auto text-center text-grey formAlign">
                <h2 className="text-center m-4 fw-bold pt-2">Sign up</h2>

                <h5 className="text-center m-3 text-white">
                  Join us and add your own recipes and many more!
                </h5>

                <label htmlFor="pseudo" className="form-label text-grey fs-4 me-3">
                  Pseudo
                </label>
                <input
                  type="text"
                  className="form-control text-center w-50 rounded-pill bg-white border border-grey"
                  id="pseudo"
                  placeholder="Your username"
                />

                <label htmlFor="mail2" className="form-label text-grey fs-4 me-3 mt-3">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control w-75 rounded-pill bg-white border border-grey text-center"
                  id="mail2"
                  placeholder="tom@company.com"
                />

                <label htmlFor="password2" className="form-label fs-4 me-3 mt-3">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control text-center w-50 rounded-pill bg-white border border-grey"
                  id="password2"
                  placeholder="Min 8 characters"
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn mx-3 fs-5 px-3 mt-3 mb-4 btn-warning rounded-pill">
                  Sign up
                </button>

              </div>
            </form>
          </div>
        </div>
      </>)}

    </div>
  );
}
