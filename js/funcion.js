


let time = document.getElementById("time");
let monto = document.getElementById("monto");
let cedula = document.getElementById("cedula");
let boton = document.getElementById("boton");
let spinner = document.getElementById("spinner");
let modal = document.getElementById("modal");
let modalContainer = document.getElementById("modalContainer");
let btnClose = document.getElementById("close");

cedula.addEventListener("keypress",(event)=>{

  const tecla = event.key;
  const esNumero = /[0-9]/.test(tecla);
   
   console.log(cedula.value);
  if(cedula.value.length >= 8){
    event.preventDefault();
  }
  
  if (!esNumero) {
    event.preventDefault();
  }
});




time.addEventListener("change",()=>{

let selectTime = time.value;

if(selectTime == "30 minutos"){
  monto.innerHTML = "3Bs"
}else if(selectTime == "1 hora"){
  monto.innerHTML = "6Bs"
}else if(selectTime == "24 horas"){
  monto.innerHTML = "37Bs"
}

});

boton.addEventListener("click",(event)=>{
   
   event.preventDefault();

   if(time.value == "" || cedula == ""){
   	  alert("debe llenar todos los campos")
   }else{

       //codigo al backend

       spinner.style.display = "inline-block"
       boton.style.display = "none"
   	   console.log(`cedula ${cedula.value} time ${time.value}`)


   	  function myFunction() {
  
   	   	 spinner.style.display = "none"
         boton.style.display = "inline-block"
         modal.style.display = "flex";
         modalContainer.style.display = "flex";
         clearInterval(intervalId); // Detener el intervalo después de la primera repetición
   }

    // Llamar a la función cada 1 segundo (1000 milisegundos)
     let intervalId = setInterval(myFunction, 2000);

   }

});

btnClose.addEventListener("click",()=>{

    modal.style.display = "none";
    modalContainer.style.display = "none";

});

