import { useState, useRef } from "react";
import axios from "axios";

export default function ForgetPassword({}) {
  const [check, setCheck] = useState(false);
  const [mail, setMail] = useState("");
  const modalRef = useRef();

  async function handleSubmit() {
    //axios request , backend send a mail to user
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/getPasswordMail",
        {
          mail,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      //setMessage(data.message);
      console.log("Réponse backend :", data);

      if (data.check) {
        setCheck(data.check);

        const mdpModal = document.getElementById("exampleModal");
        const modal = bootstrap.Modal.getInstance(mdpModal); // si ouvert
        modal.hide();
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      // setMessage(error.response?.data?.message || "Erreur réseau");
    }
  }

  return (
    <div>
      {!check ? (
        <button
          type="button"
          class="btn bg-light border"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <a>Forget your password?</a>
        </button>
      ) : (
        <p class="text-warning">
          A new password have been sent, check your mail!
        </p>
      )}

      <div
        className="modal fade mt-5"
        id="exampleModal"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        {/* modal to get password with mail*/}
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Get your password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body justify-content-center">
              <p>You can receive your password by mail</p>

              {/* enter mail input */}
              <input
                type="email"
                name="mail"
                placeholder="type your e-mail"
                required
                className="form-control text-center w-100 rounded-3 border border-grey"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Send Mail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
