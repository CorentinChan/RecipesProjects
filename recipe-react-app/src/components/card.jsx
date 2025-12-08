import { useNavigate } from "react-router-dom";
 
 export default function  Card({title,img,id}) {
 let url ='/recipe?id='+id;
  let navigate = useNavigate();

 return( 


        <div  className="col-6 col-lg-4 px-1 my-lg-3 "       data-testid={`card-${id}`} onClick={()=>{navigate(url)}}>
          <div  className="card shadow-sm h-100  " key={id}>
            <img src={img}  className="card-img-top" alt="Card 1"/>
            <div  className="card-body">
              <h5  className="card-title"> {title} </h5>
              <div className="d-flex mt-5 justify-content-between"> 
                <span>note<i className="pb-1  ms-1 fa-solid fa-star"></i></span>
                <span className="card-text">DBMEAL</span>
              </div>
             </div>
          </div>
        </div>

        )}