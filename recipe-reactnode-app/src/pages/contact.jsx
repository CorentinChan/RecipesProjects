import { useState, useEffect } from "react";
import axios from "axios";
import {Helmet} from "react-helmet";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  // useEffect(() => {
  //   setResponse('');
  // },[message])

  async function fetchMessage() {
    try {
      let mail = email;
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/sendMailContact",
        {
          name,
          mail,
          message,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log("message check :", data.check);
      setResponse(data.check);
    } catch (error) {
      console.error("error axios :", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchMessage();
  }

  return (
    <div className="d-lg-flex contactGroup  ">
      <Helmet>
        <title>contact | App Recipe</title>
        <meta name="description" content="Page contact de recipe app" />
      </Helmet>

      <section className=" contactText py-3 ">
        <div className=" container py-5">
          <div className="p-3 ms-lg-5  text-black">
            <h1>Hello , What's on your mind?</h1>
            <h4 className="mb-3 text-black-50">
              {" "}
              Credibly administrate market positioning deliverables rather than
              clicks-and-mortars methodologies. Proactiverly formulate
              out-of-the-box technology with click-and-mortar testing
              procedures. Uniquely promote leveraged web readiness for standart
              compliant value. Rapidiously ponctifate cooperative mindshare via
              maintenable applications
            </h4>
            <button
              type="button"
              className="btn  fs-5 px-3  btn-danger rounded-pill"
            >
              Schedule a call
            </button>
          </div>
        </div>
      </section>
      <section className="contactForm-container p-lg-5">
        <div className=" container ">
          <div className="p-4 border rounded-4 shadow-sm text-white bg-danger">
            <form className=" contactForm " onSubmit={handleSubmit}>
              <div className="  w-100 w-lg-75 mx-auto">
                <label htmlFor="name" className="form-label fs-4 me-3">
                  name
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill bg-danger border border-white text-white"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  minLength={3}
                />

                <label htmlFor="mail" className="form-label fs-4 me-3 mt-3">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-pill bg-danger border border-white text-white"
                  id="mail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />

                <label htmlFor="message" className="form-label fs-4 me-3 mt-3 ">
                  message
                </label>
                <input
                  type="text"
                  className="form-control rounded-4 bg-danger border border-white text-white  messageForm"
                  id="message"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  minLength={2}
                />
              </div>
              <div className=" text-center">
                {response != "Mail sent!" ? (
                  <button
                    type="submit"
                    className="btn mx-3 fs-5 px-3 mt-3 btn-warning  rounded-pill"
                  >
                    Send message
                  </button>
                ) : undefined}
              </div>
              <p className="text-center my-3 text-info">{response}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
