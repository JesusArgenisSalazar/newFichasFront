


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
let spinnerOperation = document.getElementById("spinnerOperation");
let nombreUsuario = document.getElementById("nombreUsuario"); 
let infoPerfil = document.getElementById("infoPerfil");
let modalPerfil = document.getElementById("modalPerfil");
let token;


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

   if(time.value == "" || referencia.value == "" && metodoPago == "Pago Móvil"){
   	  alert("Debe llenar todos los campos")
   }else if(referencia.value.length < 4 && metodoPago == "Pago Móvil"){
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
     fetch('http://localhost:4000/pago', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'authorization': token
       },
       body: JSON.stringify({ data: {referencia : referencia.value, monto: monto.textContent.slice(0,-3), metodoPago : metodoPago.value}})
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
           getDataUser();

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
         }else if(data.errorMessage == "Saldo insuficiente"){
           modal.style.display = "none";
           modalContainer.style.display = "none"; 
           popupText.textContent = "Saldo insuficiente"; 
           popup.classList.add('animacion-activa');
         }else if(data.errorMessage == "Acceso denegado" || data.errorMessage == "Token inválido"){
           modal.style.display = "none";
           modalContainer.style.display = "none"; 
           popupText.textContent = "Acceso denegado"; 
           popup.classList.add('animacion-activa');
         }else{
           modal.style.display = "none";
           modalContainer.style.display = "none"; 
           popupText.textContent = "Error desconocido"; 
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
           
          resetForm();
       });
     }

});

btnClose.addEventListener("click",()=>{

    modal.style.display = "none";
    modalContainer.style.display = "none";
    modalContainer.style.zIndex = "20"
    succedResult.style.display = "none"

    resetForm();


});

btnCloseOp.addEventListener("click",()=>{

    tabOp.classList.toggle("closeOp");

    if(modalContainer.style.display == "none"){
     modalContainer.style.display = "block"
   }else{
    modalContainer.style.display = "none"
   }

});

btnOpenOperation.addEventListener("click", async ()=>{
   tabOp.classList.toggle("closeOp");
  
   if(modalContainer.style.display == "none"){
     modalContainer.style.display = "block"
   }else{
    modalContainer.style.display = "none"
   }
   listOperation.innerHTML = "";
   // let datosOperations = obtenerDatos().reverse();
   let datosOperations;

   // console.log(datosOperations);
   
     spinnerOperation.style.display = "inline-block";
     popup.classList.remove('animacion-activa');  

     fetch("http://localhost:4000/operations",{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'authorization': token
       }}).then((data)=> data.json()).then((data)=>{
              
        
        if(data.errorMessage == "Acceso denegado" || data.errorMessage == "Token inválido"){
          popupText.textContent = "Acceso denegado"; 
          popup.classList.add('animacion-activa');

          spinnerOperation.style.display = "none";

          
          console.log(data);
        }else{

          spinnerOperation.style.display = "none"
             

          datosOperations = data.result.reverse();

        
          let htmldata = `<p class="alingP ">
          Tipo</p><p class="alingP ">Pin</p><p class="alingP ">Referencia</p><p class="alingP ">Monto</p><p class="alingP ">Duración</p><p class="alingP ">
          Fecha</p>`;
   
          datosOperations.forEach((e)=>{ 

          htmldata += `<p  class="label2" style="text-align:center">${e.tipo}</p>
                       <p  class="label2" style="color:#fcd535;text-align:center">${e.pin}</p>
                       <p  class="label2" style="text-align:center">${e.referencia.slice(-4) || "- - - - - - -"}</p>
                       <p  class="label2" style="text-align:center">${e.monto}</p>
                       <p  class="label2" style="text-align:center">${e.duracion || "- - - - - - -"}</p>
                       <p  class="label2" style="text-align:center">${new Date(e.createdAt).toLocaleString()}</p>                  `
       });

         listOperation.innerHTML = htmldata;
       }
        

     }).catch((error)=>{

        console.log("error al consultar operaciones", error.message)
        spinnerOperation.style.display = "none";

        if(error.message == "Failed to fetch" || error.message == "Error:Failed to fetch"){
          popupText.textContent = "Sin conexión"; 
          popup.classList.add('animacion-activa');  
        }else{
          popupText.textContent = "Error desconocido"; 
          popup.classList.add('animacion-activa'); 
        }
        
     });
 
});

infoPerfil.addEventListener("click", ()=>{
    

    if(modalPerfil.contains(event.target)){

      return
    }
    modalPerfil.classList.toggle("toggleModalContent");

});

document.addEventListener("click", (e)=>{

    
    if(infoPerfil.contains(event.target) || modalPerfil.contains(event.target) || modalRecarga.contains(event.target) ||tabOp.contains(event.target) || btnOpenOperation.contains(event.target) || btnRecarga.contains(event.target) || boton.contains(event.target)){
       return
    }

    // si modal esta abilitado y se hace click en el documento
    // no cierres ningun modal
    if (!tabOp.contains(event.target) || !modalRecarga.contains(event.target) || !modalRecarga.contains(event.target)) {
         if(modal.style.display != "none"){
          return
        }

        tabOp.classList.add("closeOp");
        modalRecarga.style.display = "none";
        modalContainer.style.display = "none";
        modalPerfil.classList.add("toggleModalContent");
        
       console.log("remodev");
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

botonReporte.addEventListener("click",async (e)=>{
    

   event.preventDefault();

   if(montoRecarga.value == "" || referenciaRecarga.value == ""){
      alert("Debe llenar todos los campos")
   }else if(referenciaRecarga.value.length < 4){
      alert("La referencia debe tener al menos 4 dígitos");
   }else{


      modal.style.display = "grid";
      modal.style.zIndex = "3000";
      modalContainer.style.display = "flex";
      modalContainer.style.zIndex = "2999"

      spinnerModal.style.display = "inline-block"
      textModal.innerHTML = "Por favor, espere a que su pago sea verificado. El tiempo estimado es de 15 segundos."
      btnClose.style.visibility = "hidden";
       
      
      popup.classList.remove('animacion-activa');

     try{

       fetch('http://localhost:4000/recarga',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'authorization': token
       },
       body: JSON.stringify({ data: {referencia:referenciaRecarga.value,monto:montoRecarga.value.slice(0,-3) }})}).then((res)=> res.json())
       .then((data)=>{
          
           console.log(data);
           if(data.result){
           textModal.innerHTML = "<span style='color:green;font-weight:bold'>¡</span>Pago verificado con éxito<span style='color:green;font-weight:bold'>!</span>"
           btnClose.style.visibility = "visible";
           spinnerModal.style.display = "none"

           getDataUser();

           }else if(data.errorMessage == "Referencia no válida" || data.errorMessage == "Referencia usada" || data.errorMessage == "Monto insuficiente" || data.errorMessage == "Saldo insuficiente"){
            
             modal.style.display = "none";
             modalContainer.style.zIndex = "20"
             popupText.textContent = data.errorMessage; 
             popup.classList.add('animacion-activa');
           
           }else if(data.errorMessage == "Navigation timeout of 1000 ms exceeded"){
             console.log("entre timeout exceeded")
             textModal.innerHTML = "El sistema tardo demasiado en responder intente nuevamente o contacte a <a href='http://wa.link/8u9r2c'>soporte.</a>"
             btnClose.style.visibility = "visible";
             spinnerModal.style.display = "none"

           }else if(data.errorMessage.slice(0,8) == "net::ERR"){
            console.log("entre net err")

             modal.style.display = "none";
             modalContainer.style.zIndex = "20"
             popupText.textContent = "Sin conexión"; 
             popup.classList.add('animacion-activa');

           }else if(data.errorMessage == "Acceso denegado" || data.errorMessage == "Token inválido"){
             
             modal.style.display = "none";
             modalContainer.style.zIndex = "20"
             popupText.textContent = "Acceso denegado"; 
             popup.classList.add('animacion-activa');

           }else{

             modal.style.display = "none";
             modalContainer.style.zIndex = "20"
             popupText.textContent = "Error desconocido"; 
             popup.classList.add('animacion-activa');
           }
           



       }).catch((error)=>{
          
          setTimeout(function() {

             if(error.message == "Failed to fetch" || error.message == "Error:Failed to fetch"){
               modal.style.display = "none";
               modalContainer.style.zIndex = "20"
               popupText.textContent = "Sin conexión"; 
               popup.classList.add('animacion-activa');  
             }else{
               modal.style.display = "none";
               modalContainer.style.zIndex = "20"
               popupText.textContent = "Error desconocido"; 
               popup.classList.add('animacion-activa'); 
             }
           }, 1500);

          resetForm();
       });


   }catch(e){
     
     console.log(e);
   }

   }
});




const getDataUser = async () =>{
     console.log("hola que tal");
  

       let dataUser = JSON.parse(localStorage.getItem('dataUser'));
       let name = dataUser.name.charAt(0).toUpperCase() + dataUser.name.slice(1);
       let lastName = dataUser.lastName.charAt(0).toUpperCase() + dataUser.lastName.slice(1);
       token = dataUser.token;
       userId = dataUser.userId;
       console.log(userId);
       fetch('http://localhost:4000/userData',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'authorization': token
       }}).then((res)=> res.json())
       .then((res)=>{

           if(res.errorMessage == "Acceso denegado" || res.errorMessage == "Token inválido"){

             popupText.textContent = "Acceso denegado"; 
             popup.classList.add('animacion-activa');
           }else{

            saldo.innerHTML = res.result;
            nombreUsuario.textContent = `${name} ${lastName}`
           }
          
          

       }).catch((error)=>{
          
          console.log(error.message);
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
       });

}

let resetForm = ()=>{

  time.value = "";
  metodoPago.value = "";
  referencia.value = ""
  montoRecarga.value = ""
  referenciaRecarga.value = "";
}

getDataUser();

