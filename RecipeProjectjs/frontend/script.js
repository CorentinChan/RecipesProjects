console.log("script.js chargé !");

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
    window.location.href = 'search ';
}


function searchClose() {
  searchWindow.style.display = 'none';
  
}

//display signin page
if(document.getElementById('signinButton')){ 
  signinButton = document.getElementById('signinButton');
  signWindow = document.getElementById('signWindow');
  overlay = document.getElementById('overlay1');

  signinButton.addEventListener('click', () => {
    signWindow.style.display = 'block';
    overlay.style.display = 'block';
});
}

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
/*
    function addStep(){
      console.log('addstep')
      let liste=document.querySelector('.instructionsList');
      
      liste.innerHTML+=' <li class="list-group-item border-0 border-bottom" > <input class="form-control form-control-sm  m-3 p-2 w-75" type="text" placeholder="write ingredient" ></li>';
    }
*/

//print page
if(document.getElementById("print")){ 
  document.getElementById("print").addEventListener("click", function() {
  window.print();
});
}


function gotoRecipe(type, id) {
let cards = document.querySelectorAll('.card');


    document.getElementById("myForm").submit();
}

//fetch for signin check
if(document.getElementById('signinSubmit')){ 
  const buttonSignin = document.getElementById('signinSubmit');
  buttonSignin.addEventListener('click', async (e) => {
  e.preventDefault(); // empêche le rechargement de la page
   let formSignin = document.getElementById('changePasswordForm');
   console.log('fetch function after submit');
   // const form = e.target;
    const password = form.password.value;
    const email = form.mail.value;

    try {
        const res = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                email
            })
        });

        const data = await res.json();

        const message = document.getElementById('responseMessage');
        if (data.succeed) {
            message.style.color = 'green';
            form.remove();
            button.remove();
            message.textContent = data.erreur;
        } else {
            message.style.color = 'red';
            message.textContent = data.erreur;
        }

    } catch (err) {
        console.error(err);
        document.getElementById('responseMessage').textContent = 'Erreur de connexion au serveur.';
    }
    });

  }

//fetch for change password check
if(document.getElementById('changePasswordButton')){ 
  const button = document.getElementById('changePasswordButton');
  button.addEventListener('click', async (e) => {
  e.preventDefault(); // empêche le rechargement de la page
   let form = document.getElementById('changePasswordForm');
   console.log('fetch function after dubmit')
   // const form = e.target;
    const passwordCurrent = form.passwordCurrent.value;
    const passwordNew = form.passwordNew.value;
    const passwordNew2 = form.passwordNew2.value;

    try {
        const res = await fetch('/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passwordCurrent,
                passwordNew,
                passwordNew2
            })
        });

        const data = await res.json();

        const message = document.getElementById('responseMessage');
        if (data.succeed) {
            message.style.color = 'green';
            form.remove();
            button.remove();
            message.textContent = data.message;
        } else {
            message.style.color = 'red';
            message.textContent = data.message;
        }

    } catch (err) {
        console.error(err);
        document.getElementById('responseMessage').textContent = 'Erreur de connexion au serveur.';
    }
    });

  }

//check form validity

window.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
});

//to check in live during taping
document.querySelectorAll('.form-control').forEach(input => {
  input.addEventListener('input', e => {
    if (input.checkValidity()) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
  });
});



//login page
//fetch for signin check
if(document.getElementById('signinSubmit')){ 
  const buttonSignin = document.getElementById('signinSubmit');
  buttonSignin.addEventListener('click', async (e) => {
  e.preventDefault(); // empêche le rechargement de la page
   let formSignin = document.getElementById('signinForm');
   console.log('fetch function after submit');
   // const form = e.target;
    const password = formSignin.password.value;
    const mail = formSignin.mail.value;

    try {
        const res = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                mail
            })
        });

        const data = await res.json();

        const message = document.getElementById('responseMessage');
        if (data.succeed) {
           buttonSignin.remove();
            message.style.color = 'green';
            message.style.padding = '5em';
            message.textContent = "You are connected, redirect in 0.5s";
            let i = 4;
            const interval = setInterval(function () {
              message.textContent = "You are connected, redirect in " + i + 's';
              i -= 1;
              if (i < 0) {
                clearInterval(interval);
                location.reload(); // ou window.location.href = '/'; selon ton besoin
              }
            }, 100); 
        } else {
            message.style.color = 'red';
            message.textContent = data.message;
        }

    } catch (err) {
        console.error(err);
        document.getElementById('responseMessage').textContent = 'Erreur de connexion au serveur.';
    }
    });

  }

//display signup div
document.getElementById("signupButton").addEventListener("click", function() {
  document.getElementById("overlayb2").style.display = "block";
        document.getElementById("overlayb1").style.display = 'none';

});
/*
function signupClose() {
  document.getElementById('overlayb2').style.display = 'none';
}

*/


//signup fetch message
//fetch for signout check
if(document.getElementById('signupSubmit')){ 
  const buttonSignup = document.getElementById('signupSubmit');
  buttonSignup.addEventListener('click', async (e) => {
  e.preventDefault(); // empêche le rechargement de la page
   let formSignup = document.getElementById('signupForm');
   console.log('fetch function after submit');
   // const form = e.target;
    const password = formSignup.password.value;
    const mail = formSignup.mail.value;
    const pseudo = formSignup.pseudo.value;

    try {
        const res = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                mail,
                pseudo
            })
        });

        const data = await res.json();

        const message = document.getElementById('responseMessageSignup');
        if (data.succeed) {
            message.style.color = 'green';
            message.textContent = "Your account have been created, redirect in 3s";
            buttonSignup.remove();
             //formSignup.remove();;
            
                     let i=2;
                  const interval = setInterval(function() {
                       message.textContent="Your account have been created, redirect in "+i+'s';
                       i-=1;
                            if (i < 0) {
                            clearInterval(interval);
                            location.reload(); // ou window.location.href = '/'; selon ton besoin
                          }
                    }, 1000); 
        } else {
            message.style.color = 'blue';
            message.textContent = data.message;
        }

    } catch (err) {
        console.error(err);
        document.getElementById('responseMessageSignup').textContent = 'Erreur de connexion au serveur.';
    }
    });

  }
