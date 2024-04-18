

const name = document.getElementById("nombre");
const lastName = document.getElementById("apellido");
const email = document.getElementById("correo");
const password = document.getElementById("contraseña");
const sendButton = document.getElementById("boton");
const sendButtonLogin = document.getElementById("botonLogin");




sendButton.addEventListener("click", (e)=>{
   e.preventDefault();
   console.log("lol");
   
   fetch('http://localhost:4000/user', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ data: {name : name.value, lastName: lastName.value, email:email.value,password:password.value}})
     }).then(response => response.json())
       .then(data => {

       	  console.log(data);
       });

});

sendButtonLogin.addEventListener("click", (e)=>{
  e.preventDefault();
  console.log("lol");

});



