import { useState } from 'react'
 import Footer from '/src/components/footer.jsx'


export default function  Contact() {
    return (
  <div className = "d-lg-flex contactGroup  " >

<section className=" contactText py-3 ">

  <div className=" container py-5">
    <div className="p-3 ms-lg-5  text-black">
    <h1>Hello , What's on your mind?</h1>
    <h4 className="mb-3 text-black-50"> Credibly administrate market positioning deliverables rather than clicks-and-mortars methodologies. Proactiverly formulate out-of-the-box technology with click-and-mortar testing procedures. Uniquely promote leveraged web readiness for standart compliant value. Rapidiously ponctifate cooperative mindshare via maintenable applications
    </h4>
        <button type="button" className="btn  fs-5 px-3  btn-danger rounded-pill">Schedule a call</button>

    </div>
  </div>

</section>

<section className="contactForm-container p-lg-5">

  <div className=" container ">
  <div className="p-4 border rounded-4 shadow-sm text-white bg-danger">

    <form className=" contactForm ">
      <div className="  w-100 w-lg-75 mx-auto">
        <label htmlFor="name" className="form-label fs-4 me-3">name</label>
        <input type="text" className="form-control rounded-pill bg-danger border border-white text-white" id="name"/ >
        
        <label htmlFor="mail" className="form-label fs-4 me-3 mt-3">Email</label>
        <input type="text" className="form-control rounded-pill bg-danger border border-white text-white" id="mail"/ >
      
        <label htmlFor="message" className="form-label fs-4 me-3 mt-3 ">message</label>
        <input type="text" className="form-control rounded-4 bg-danger border border-white text-white  messageForm" id="message"/>
  
   
      </div>
      <div className=" text-center">
       <button type="submit" className="btn mx-3 fs-5 px-3 mt-3 btn-warning  rounded-pill">Send message</button>
    </div>

    </form>
  </div>
</div>

</section>


</div>


    )
}