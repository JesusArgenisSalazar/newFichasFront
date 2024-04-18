const email = document.getElementById("correo");
const password = document.getElementById("contraseña");
const sendButtonLogin = document.getElementById("botonLogin");


sendButtonLogin.addEventListener("click", (e)=>{
  e.preventDefault();
  console.log("lol");
   
   fetch('http://localhost:4000/login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ data: {email:email.value,password:password.value}})
     }).then(response => response.json())
       .then(data => {

       	  console.log(data);
       	  if(data.sesion){
            localStorage.setItem("userId", JSON.stringify(data.sesion));
            window.location.href = "file:///C:/Users/PC/Desktop/projects/new%20version/frontFichas/index.html"
       	  }
       });
});
