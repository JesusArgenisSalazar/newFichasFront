
function obtenerDatos() {
  return JSON.parse(localStorage.getItem('datos')) || [];
}

function guardarDatos(datos) {
  datosStorage = obtenerDatos();
  if(datosStorage.length >= 3){
  	  datosStorage.splice(0, 1);
  }

  datosStorage.push(datos);
  localStorage.setItem("datos", JSON.stringify(datosStorage));
}


