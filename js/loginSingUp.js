

const name = document.getElementById("nombre");
const lastName = document.getElementById("apellido");
const email = document.getElementById("correo");
const password = document.getElementById("contraseña");
const sendButton = document.getElementById("boton");
const ErrorMessageNombre = document.getElementById("ErrorMessageNombre");
const ErrorMessageApellido = document.getElementById("ErrorMessageApellido");
const ErrorMessageEmail = document.getElementById("ErrorMessageEmail");
const ErrorMessagePassword = document.getElementById("ErrorMessagePassword");
const blockTecla = document.querySelectorAll("input");
const spinner = document.getElementById("spinner");
let popup = document.querySelector(".popup");
let popupText = document.querySelector("#textError"); 
let eyePassword = document.getElementById("eyePassword");



sendButton.addEventListener("click", (e)=>{
   e.preventDefault();
   console.log("lol");

   let validEmail = validarEmail(email.value);
   let validPassword = validarPassword(password.value);
   let validNombres = validarNombres(name.value);
   let validApellido = validarApellido(lastName.value);
   

   if(validNombres && validApellido && validarEmail && validPassword){
      
   spinner.style.display = "inline-block"
   sendButton.style.display = "none"
   popup.classList.remove('animacion-activa');

      fetch('https://apibvc-production.up.railway.app/user', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ data: {name : name.value, lastName: lastName.value, email:email.value,password:password.value}})
     }).then(response => response.json())
       .then(data => {

          console.log(data);

          spinner.style.display = "none";
          sendButton.style.display = "inline-block"

          if(data.result){
            window.location.href = "/login.html"
          }else if(data.errorMessage == "Este correo esta en uso"){
             
            popupText.textContent = data.errorMessage; 
            popup.classList.add('animacion-activa');
          }else{
            popupText.textContent = "Error desconocido"; 
            popup.classList.add('animacion-activa');
          }
       }).catch((error)=>{
           
           console.log(error.message);
           setTimeout(function() {

             if(error.message == "Failed to fetch" || error.message == "Error:Failed to fetch"){
               spinner.style.display = "none"
               botonLogin.style.display = "inline-block"
               popupText.textContent = "Sin conexión"; 
               popup.classList.add('animacion-activa');      
             }else{
               spinner.style.display = "none"
               botonLogin.style.display = "inline-block"
               popupText.textContent = "Error desconocido"; 
               popup.classList.add('animacion-activa');  
             }
           }, 1500);
       });
   }
  

});



name.addEventListener("input",()=>{
  
   validarNombres(name.value)
});

lastName.addEventListener("input",()=>{

   validarApellido(lastName.value)
});

email.addEventListener("input", ()=>{

    validarEmail(email.value);

});

password.addEventListener("input", (e)=>{
    
    validarPassword(password.value);
});



blockTecla.forEach((el)=>{

   el.addEventListener("keypress", (e)=>{
    if(e.target.value.length > 35){
      e.preventDefault();
    }
  })
});




const validarNombres = (nombre)=>{


    if(nombre == ""){

      ErrorMessageNombre.textContent = "Campo obligatorio"
      return false
    }else if(nombre.length > 40  ){
      ErrorMessageNombre.textContent = "Logitud maxima 40 caracteres"
      return false
    }else if(nombre.length < 4){
      ErrorMessageNombre.textContent = "Logitud minima 4 caracteres"
      return false
    }else{
      ErrorMessageNombre.textContent = ""
      return true

    }
}

const validarApellido = (apellido)=>{
  
  if(apellido == ""){
      ErrorMessageApellido.textContent = "Campo obligatorio";
      return false
    }else if(apellido.length > 40){
      ErrorMessageApellido.textContent = "Logitud maxima 20 caracteres"
      return false
    }else if(apellido.length < 4){
      ErrorMessageApellido.textContent = "Logitud minima 4 caracteres"
      return false
    }else{
      ErrorMessageApellido.textContent = "";
      return true
    }

}


const validarEmail = (email)=>{
  
  let patron = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if(email == ""){

      ErrorMessageEmail.textContent = "Campo obligatorio"
      return false
    }else if(patron.test(email) == false){
      ErrorMessageEmail.textContent = "Formato de correo no valido"
      return false

    }else if(email.length > 40){
      ErrorMessageEmail.textContent = "Logitud maxima 40 caracteres"
      return false
    }else{
      ErrorMessageEmail.textContent = ""
      return true

    }

}

const validarPassword = (password)=>{
  
  if(password == ""){
      ErrorMessagePassword.textContent = "Campo obligatorio";
      return false
    }else if(password.length > 20){
      ErrorMessagePassword.textContent = "Logitud maxima 20 caracteres"
      return false
    }else if(password.length < 8){
      ErrorMessagePassword.textContent = "Logitud manima 8 caracteres"
      return false
    }else{
      ErrorMessagePassword.textContent = "";
      return true
    }

}


eyePassword.addEventListener("click",(e)=>{
   
    if(password.type == "text"){

       password.type = "password"
       eyePassword.src = "svg/eyeoff.svg"
    }else{

       password.type = "text"
       eyePassword.src = "svg/eyeon.svg"


    }
});

