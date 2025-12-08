document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;
  console.log("url actuel : " + currentPath);
  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add('urlActive');
      console.log("url active : " + linkPath);
    } else {
      link.classList.remove('urlActive');
    }
  });
});


searchButton = document.getElementById('searchButton');
searchWindow = document.getElementById('searchWindow');
let windowStatus= "none";
searchButton.addEventListener('click', () => {

  if(windowStatus=="none")
 { searchWindow.style.display = 'block';  

  //add animation
  searchButton.classList.add('rotatec');
  searchWindow.classList.add('slide-in-blurred-left');


  /*
  document.querySelector(".btnCustom").style.width="5em";
  document.querySelector(".btnCustom2").style.width="5em";
  */
  windowStatus="block";
 }
 else{

  sendSearch();
 /* windowStatus="none";
  searchWindow.style.display = "none";
  
  //document.querySelector(".btnCustom").style.width = "5em";
  //document.querySelector(".btnCustom2").style.width = "5em";
  */
 }

});


 searchWindow.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      sendSearch();
   }
});

function sendSearch(){
      let mot = searchWindow.value;
    localStorage.setItem('searchKey',mot);
    console.log(mot);
    window.location.href = 'search.html';
}


function searchClose() {
  searchWindow.style.display = 'none';
  
}

//display signin page
signinButton = document.getElementById('signinButton');
signWindow = document.getElementById('signWindow');
overlay = document.getElementById('overlay1');

signinButton.addEventListener('click', () => {
  signWindow.style.display = 'block';
  overlay.style.display = 'block';
});

function displaySignin(){
  signWindow.style.display = 'block';
  overlay.style.display = 'block';
}

//close signin window
function signinClose() {
  document.getElementById('signWindow').style.display = 'none';
  document.getElementById('overlay1').style.display = 'none';
  
}



//display signup div


function displaySignup (){
     document.getElementById("overlay2").style.display = "block"; 
     
     
}

// close window with button
function signupClose() {
  document.getElementById('overlay2').style.display = 'none';
}
//close window with click outside the window

document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {
      overlay.style.display = 'none';
    }
  });
});

overlay2= document.getElementById('overlay2');

  overlay2.addEventListener('click', function(event) {
    if (event.target === overlay2) {
      overlay2.style.display = 'none';
    }
  });


  //form page 
    //add steps

    function addStep(){
      console.log('addstep')
      let liste=document.querySelector('.instructionsList');
      
      liste.innerHTML+=' <li class="list-group-item border-0 border-bottom" > <input class="form-control form-control-sm  m-3 p-2 w-75" type="text" placeholder="write ingredient" ></li>';
    }

//print page
document.getElementById("print").addEventListener("click", function() {
window.print();
});


