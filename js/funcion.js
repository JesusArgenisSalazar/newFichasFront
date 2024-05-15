


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
let btnCerrarSesion = document.getElementById("btnCerrarSesion");
let button__addTickets = document.getElementById("button__addTickets");
let modalAddTickets = document.getElementById("modalAddTickets");
let btnCloseAddTickets = document.getElementById("btnCloseAddTickets");
let areaText = document.getElementById("areaText");
let archivo = document.getElementById("archivo");
let counterFichas = document.getElementById("counterFichas");
let botonAddFichas = document.getElementById("botonAddFichas");
let tipoTickets = document.getElementById("tipoTickets");
let mostraVentanaEmergente = true;
let token;




if(!localStorage.getItem("dataUser")){

  window.location.href = "/login.html"
}else{
  
  let info = JSON.parse(localStorage.getItem('dataUser'))
  
  if(info.typeUser != "admin"){

    button__addTickets.style.display = "none";
  }

}
 window.onbeforeunload = function(event) {

  if(mostraVentanaEmergente){
    event.returnValue = "¿Estás seguro de que deseas abandonar esta página?";
  }
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
     fetch('https://newapibvc-production.up.railway.app/pago', {
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
         }else if(data.errorMessage.slice(0,17) == "Evaluation failed" ){ 
           modal.style.display = "none";
           modalContainer.style.display = "none"; 
           popupText.textContent = "Error bancario, reintente"; 
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

     fetch("https://newapibvc-production.up.railway.app/operations",{
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

button__addTickets.addEventListener("click",()=>{
   
   modalContainer.style.display = "block";
   modalAddTickets.style.display = "grid"
     
});

botonAddFichas.addEventListener("click",(event)=>{
     
     event.preventDefault();
     
     let pines = areaText.value;
     let tipoFicha = tipoTickets.value;
     
     popup.classList.remove('animacion-activa');

     try{
   
        fetch('https://newapibvc-production.up.railway.app/addTickets',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'authorization': token
       },
       body: JSON.stringify({ data: {pines: pines, tipoFicha:tipoFicha }})}).then((res)=> res.json())
       .then((res)=>res).then((res)=>{

           console.log(res);
           if(res.result){

            areaText.value = "";
            tipoTickets.value = "";

           }else{
            popupText.textContent = res.errorMessage; 
            popup.classList.add('animacion-activa');
           }

       }).catch((error)=>{
          
          console.log("error al cargar fichas.");
          popupText.textContent = data.errorMessage; 
          popup.classList.add('animacion-activa');

       });

     }catch(error){
      
      console.log("error al cargar fichas2.");
 
     } 
    

});

infoPerfil.addEventListener("click", ()=>{
    

    if(modalPerfil.contains(event.target)){

      return
    }
    modalPerfil.classList.toggle("toggleModalContent");

});

document.addEventListener("click", (event)=>{

    
    if(infoPerfil.contains(event.target) || modalPerfil.contains(event.target) || modalRecarga.contains(event.target) ||tabOp.contains(event.target) || btnOpenOperation.contains(event.target) || btnRecarga.contains(event.target) || boton.contains(event.target) || button__addTickets.contains(event.target) || modalAddTickets.contains(event.target) || botonAddFichas.contains(event.target)){
       return
    }

    // si modal esta abilitado y se hace click en el documento
    // no cierres ningun modal
    if (!tabOp.contains(event.target) || !modalRecarga.contains(event.target) || !modalRecarga.contains(event.target) || !modalAddTickets.contains(event.target)) {
         if(modal.style.display != "none"){
          return
        }

        tabOp.classList.add("closeOp");
        modalRecarga.style.display = "none";
        modalAddTickets.style.display = "none";
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

btnCloseAddTickets.addEventListener("click",(e)=>{
      
   modalContainer.style.display = "none";
   modalAddTickets.style.display = "none"

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
       
       //https://newapibvc.onrender.com/recarga
       fetch('https://newapibvc-production.up.railway.app/recarga',{
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

           }else if(data.errorMessage.slice(0,17) == "Evaluation failed" ){
             
             modal.style.display = "none";
             modalContainer.style.zIndex = "20"
             popupText.textContent = "Error bancario, reintente"; 
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
       fetch('https://newapibvc-production.up.railway.app/userData',{
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
            console.log("colocado")
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


archivo.addEventListener("change", ()=>{

//Obtiene el contenido del docx con jszip y luego se parsea a texto plano
function cargarArchivo() {
  const archivo = document.getElementById('archivo').files[0];
  const lector = new FileReader();

  lector.onload = function(evento) {
    const contenido = evento.target.result;
    const zip = new JSZip();

    zip.loadAsync(contenido).then(function(zip) {
      // Accede al contenido del archivo docx
      const contenidoDocx = zip.file('word/document.xml').async('string').then(function(contenidoXml) {
  // Utiliza DOMParser para analizar el contenido XML
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(contenidoXml, "text/xml");

  // Extrae el texto plano del contenido XML
  var contenidoTexto = xmlDoc.documentElement.textContent;

  // Aquí puedes trabajar con el contenido de texto plano
  // console.log(contenidoTexto.split("Pin: ").slice("1"));
  let tickets = contenidoTexto.split("Pin: ").slice("1");

   
  let dataArea = "";

  tickets.forEach((elm)=>{
    
     dataArea += `${elm}\n`  
  });
  areaText.value = dataArea.trim();
  counterFichas.innerHTML = `<span style="font-size: 15px; color: green">  ${dataArea.trim().split("\n").length} pines cargados</span>`

})
});
   
}

lector.readAsArrayBuffer(archivo);

}
  cargarArchivo();
});
btnCerrarSesion.addEventListener("click",()=>{
  
  mostraVentanaEmergente = false;
  localStorage.removeItem("dataUser");
  window.location.href = "/newFichasFront/"

});

let resetForm = ()=>{

  time.value = "";
  metodoPago.value = "";
  referencia.value = ""
  montoRecarga.value = ""
  referenciaRecarga.value = "";
}

getDataUser();

