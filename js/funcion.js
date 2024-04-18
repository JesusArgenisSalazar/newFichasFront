


let time = document.getElementById("time");
let metodoPago = document.getElementById("metodoPago");
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
let btnCloseOp = document.getElementById("btnCloseOp");
let tabOp = document.querySelector(".tap__operations");
let btnOpenOperation = document.querySelector(".button__operations");
let listOperation = document.querySelector(".list_operations");
let cardPagoMovil = document.getElementById("cardPagoMovil");
let saldo = document.getElementById("saldo");
let btnRecarga = document.getElementById("btnRecarga");
let modalRecarga = document.getElementById("modalRecarga");
let btnCloseRecarga = document.getElementById("btnCloseRecarga");
let botonReporte = document.getElementById("botonReporte");
let montoRecarga = document.getElementById("montoRecarga");
let referenciaRecarga = document.getElementById("referenciaRecarga");

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

metodoPago.addEventListener("change",()=>{

     let metodo = metodoPago.value;

     if(metodo == "Pago Móvil"){

       cardPagoMovil.style.display = "block"
     }else if(metodo == "Saldo" || metodo == ""){
       cardPagoMovil.style.display = "none"
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

           let datos = {
             pin : data.result,
             ref : referencia.value,
             duracion : time.value,
             fecha : new Date().toLocaleDateString()
           }

           guardarDatos(datos);

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

btnCloseOp.addEventListener("click",()=>{

    tabOp.classList.toggle("closeOp");

});

btnOpenOperation.addEventListener("click",()=>{
   tabOp.classList.toggle("closeOp");

   listOperation.innerHTML = "";
   let datosOperations = obtenerDatos().reverse();
   let htmldata = `<p class="alingP "><span class="material-symbols-outlined">
password
</span>Pin</p><p class="alingP "><span class="material-symbols-outlined">
paid
</span>Pago</p><p class="alingP "><span class="material-symbols-outlined">
timer
</span>Duración</p><p class="alingP "><span class="material-symbols-outlined">
calendar_month
</span>Fecha</p>`;
   
   datosOperations.forEach((e)=>{ 

     htmldata += `<p  class="label2" style="color:#fcd535">${e.pin}</p>
                  <p  class="label2">${e.ref.slice(-4)}</p>
                  <p  class="label2">${e.duracion}</p>
                  <p  class="label2">${e.fecha}</p>
                  `
   });

   listOperation.innerHTML = htmldata;
});

document.addEventListener("click", (e)=>{
    if(btnOpenOperation.contains(event.target)){
       return
    }
    if (!tabOp.contains(event.target)) {
        tabOp.classList.add("closeOp");
    }
    


});

btnRecarga.addEventListener("click", (e)=>{
   
   modalContainer.style.display = "block";
   modalRecarga.style.display = "grid";

});


btnCloseRecarga.addEventListener("click", (e)=>{
     
   modalContainer.style.display = "none";
   modalRecarga.style.display = "none";
});

botonReporte.addEventListener("click", (e)=>{
    

   event.preventDefault();

   if(montoRecarga.value == "" || referenciaRecarga.value == ""){
      alert("Debe llenar todos los campos")
   }else if(referenciaRecarga.value.length < 4){
      alert("La referencia debe tener al menos 4 dígitos");
   }else{

     alert("listo");

   }
});




const getDataUser = async () =>{
     console.log("hola que tal");
   try{

       let userId = JSON.parse(localStorage.getItem('userId'));
       console.log(userId);
       fetch('http://localhost:4000/userData',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ data: {userId}})}).then((res)=> res.json())
       .then((res)=>{
          
           saldo.innerHTML = res.result;
       });


   }catch(e){
     
     console.log(e);
   }
}

getDataUser();

