


let time = document.getElementById("time");
let monto = document.getElementById("monto");
let referencia = document.getElementById("referencia");
let boton = document.getElementById("boton");
let spinner = document.getElementById("spinner");
let spinnerModal = document.getElementById("spinnerModal")
let modal = document.getElementById("modal");
let modalContainer = document.getElementById("modalContainer");
let btnClose = document.getElementById("btnClose");
let textModal = document.getElementById("textModal")
let succedResult = document.getElementById("succedResult");
let popup = document.querySelector(".popup");
let popupText = document.querySelector("#textError"); 
let pin = document.getElementById("pin");


 window.onbeforeunload = function(event) {
  event.returnValue = "¿Estás seguro de que deseas abandonar esta página?";
};

referencia.addEventListener("keypress",(event)=>{

  const tecla = event.key;
  const esNumero = /[0-9]/.test(tecla);
   
   
  if(referencia.value.length >= 20){
    event.preventDefault();
  }
  
  if (!esNumero) {
    event.preventDefault();
  }
});


time.addEventListener("change",()=>{

let selectTime = time.value;

if(selectTime == "30 minutos"){
  monto.innerHTML = "3 Bs"
}else if(selectTime == "1 hora"){
  monto.innerHTML = "6 Bs"
}else if(selectTime == "24 horas"){
  monto.innerHTML = "37 Bs"
}

});

boton.addEventListener("click",(event)=>{
   
   event.preventDefault();

   if(time.value == "" || referencia.value == ""){
   	  alert("Debe llenar todos los campos")
   }else if(referencia.value.length < 4){
      alert("La referencia debe tener al menos 4 dígitos");
   }else{

        modal.style.display = "grid";
        modalContainer.style.display = "flex";
        spinnerModal.style.display = "inline-block"
        textModal.innerHTML = "Por favor, espere a que su pago sea verificado. El tiempo estimado es de 15 segundos."
        btnClose.style.visibility = "hidden";
       
      
      popup.classList.remove('animacion-activa');

     //peticion a la api
     //https://apibvc-production.up.railway.app/pago
     fetch('https://apibvc-production.up.railway.app/pago', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ data: {referencia : referencia.value, monto: monto.textContent.slice(0,-3)}})
     }).then(response => response.json())
       .then(data => {
         console.log(data);

         if(data.result){

           textModal.innerHTML = "<span style='color:green;font-weight:bold'>¡</span>Pago verificado con éxito<span style='color:green;font-weight:bold'>!</span>"
           btnClose.style.visibility = "visible";
           spinnerModal.style.display = "none";
           succedResult.style.display = "block"
           pin.innerHTML = data.result;

         }else if(data.errorMessage == "No hay Fichas"){
           
          btnClose.style.visibility = "visible";
          spinnerModal.style.display = "none";
          textModal.innerHTML = `Lo sentimos actualmente el sistema no tiene cargadas fichas de <span style="color:#fcd535">${time.value}</span>`

         }else if(data.errorMessage == "Navigation timeout of 50000 ms exceeded"){
          
          btnClose.style.visibility = "visible";
          spinnerModal.style.display = "none"
          textModal.innerHTML = "El sistema tardo demasiado en responder intente nuevamente o contacte a <a href='http://wa.link/8u9r2c'>soporte.</a>"
         
         }else if(data.errorMessage == "Referencia no válida" || data.errorMessage == "Referencia usada" || data.errorMessage == "Monto insuficiente"){
          modal.style.display = "none";
          modalContainer.style.display = "none"; 
          popupText.textContent = data.errorMessage; 
          popup.classList.add('animacion-activa');

         }else if(data.errorMessage.slice(0,8) == "net::ERR"){
           modal.style.display = "none";
           modalContainer.style.display = "none"; 
           popupText.textContent = "Sin conexión"; 
           popup.classList.add('animacion-activa');
         }
         
       }).catch(error => {
           console.log(error.message);
           setTimeout(function() {

             if(error.message == "Failed to fetch" || error.message == "Error:Failed to fetch"){
               modal.style.display = "none";
               modalContainer.style.display = "none"; 
               popupText.textContent = "Sin conexión"; 
               popup.classList.add('animacion-activa');      
             }else{
               modal.style.display = "none";
               modalContainer.style.display = "none"; 
               popupText.textContent = "Error desconocido"; 
               popup.classList.add('animacion-activa');  
             }
           }, 1500);
           

       });
     }

});

btnClose.addEventListener("click",()=>{

    modal.style.display = "none";
    modalContainer.style.display = "none";
    succedResult.style.display = "none"

});

