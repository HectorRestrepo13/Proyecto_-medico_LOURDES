let btnCerrarSesion = document.getElementById("btnCerrarSesion");
let datosLocal = window.localStorage;

(function () {
  // Evento para cerrar sesión
  btnCerrarSesion.addEventListener("click", () => {
    datosLocal.clear();
    window.location.href = "../index.html";
  });

  // Verificar si el usuario ha iniciado sesión al cargar la página
  window.addEventListener("DOMContentLoaded", function () {
    if (!usuarioHaIniciadoSesion()) {
       redireccionarALogin();
    }
  });

  // Función para verificar si el usuario ha iniciado sesión
  function usuarioHaIniciadoSesion() {
    

    return datosLocal.getItem(1) != null ? true : false;
  }

  //Función para redirigir a la página de inicio de sesión si no hay sesión activa

  function redireccionarALogin() {
    if (window.location.pathname !== "../index.html") {
      window.location.href = "../index.html";
    }
   }
})();