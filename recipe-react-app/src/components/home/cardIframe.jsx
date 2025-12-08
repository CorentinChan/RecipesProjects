import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
 export default function  CardIframe({title,videoUrl,id}) {
 let url ='/recipe?id='+id;
  let navigate = useNavigate();


 return( 

          <div  className="card shadow-sm h-100  " >
          <iframe src={videoUrl} title="videoframe" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
           <div className="card-body">
              <h5 className="card-title">{title}</h5>
      
            </div>         

      </div>

        )}