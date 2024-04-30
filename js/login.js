const email = document.getElementById("correo");
const password = document.getElementById("contraseña");
const sendButtonLogin = document.getElementById("botonLogin");
const ErrorMessage = document.getElementById('ErrorMessage');
const ErrorMessagePassword = document.getElementById("ErrorMessagePassword")
const spinner = document.getElementById("spinner");
let popup = document.querySelector(".popup");
let popupText = document.querySelector("#textError"); 
let logeoGoogle = document.getElementById("logeoGoogle");

const loginValid = false;

sendButtonLogin.addEventListener("click", (e)=>{
  e.preventDefault();

  let validPassword = validarPassword(password.value);
  let validEmail = validarEmail(email.value);

  if(validEmail && validPassword){
    
   spinner.style.display = "inline-block"
   botonLogin.style.display = "none"
   popup.classList.remove('animacion-activa');


   fetch('https://newapibvc.onrender.com/login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ data: {email:email.value,password:password.value}})
     }).then(response => response.json())
       .then(data => {

          console.log(data);
          spinner.style.display = "none";
          botonLogin.style.display = "inline-block"

          if(data.sesion){
            localStorage.setItem("dataUser", JSON.stringify(data.sesion));
            window.location.href = "/index.html"
          }else if(data.errorMessage == "Contraseña incorecta" || data.errorMessage == "Email no existe"){
             
            popupText.textContent = data.errorMessage; 
            popup.classList.add('animacion-activa');
          }else{
            popupText.textContent = "Error desconocido"; 
            popup.classList.add('animacion-activa');
          }
           
          
       });
         
    }
  
});


logeoGoogle.addEventListener("click", (e)=>{

    e.preventDefault();


});
email.addEventListener("input", ()=>{

    validarEmail(email.value);

});

password.addEventListener("input", (e)=>{
    
    validarPassword(password.value);
});

password.addEventListener("keypress", (e)=>{
    
    if(password.value.length > 35){
      e.preventDefault();
    }
})

email.addEventListener("keypress", (e)=>{
    
    if(email.value.length > 35){
      e.preventDefault();
    }
})


const validarEmail = (email)=>{
  
  let patron = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if(email == ""){

      ErrorMessage.textContent = "Campo obligatorio"
      return false
    }else if(patron.test(email) == false){
      ErrorMessage.textContent = "Formato de correo no valido"
      return false

    }else if(email.length > 40){
      ErrorMessage.textContent = "Logitud maxima 40 caracteres"
      return false
    }else{
      ErrorMessage.textContent = ""
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
    }else{
      ErrorMessagePassword.textContent = "";
      return true
    }

}