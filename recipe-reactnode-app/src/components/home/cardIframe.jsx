import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
 export default function  CardIframe({title,videoUrl,id,isRecipe}) {
 let url ='/recipe?id='+id;
  let navigate = useNavigate();

  if(isRecipe){


  }

   //const [addURL, setAddURL] = useState("");
 

 return( 

             <div  className="card shadow-sm h-100  " id='card'  >

          <iframe src={videoUrl} title="videoframe" frameBorder="0" allow="accelerometer;
           autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />

           <div className="card-body" onClick={ isRecipe? ()=>{navigate(url)}:undefined} >
              <h5 className="card-title">{title}</h5>
      
            </div>         

      </div>

        )}