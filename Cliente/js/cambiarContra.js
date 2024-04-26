/* document.addEventListener("DOMContentLoaded", function () {
    let CambiarPassword = document.getElementById("btnCambiarContrasena");
    CambiarPassword.addEventListener("click", () => {
      const txtIdenti = document.getElementById("txtIdenti").value;
      const txtContraNueva = document.getElementById("txtContraNueva").value;
  
      if (txtContraNueva.length === 0 || txtIdenti.length === 0) {
        Swal.fire({
          title: "Faltan Casillas por llenar",
          text: "Llena las casillas para poder iniciar",
          icon: "warning",
        });
        return;
      }
  
      verificarUsuario(txtIdenti, txtContraNueva);
    });
  });
  
  function verificarUsuario(identi, password) {
    const datosOptenidos = { nuevaContrasena: password };
  
    fetch(`http://localhost:3000/login/cambiarContrasenaPaciente/${identi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosOptenidos)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos");
      }
    })
    .then(data => {
      if (data.status !== false) {
        // El usuario está registrado como paciente, realiza las acciones necesarias
        console.log("Usuario registrado como paciente");
      } else {
        // El usuario no está registrado como paciente, verifica la siguiente API
        verificarUsuarioAPI2(identi, password, datosOptenidos);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }
  
  function verificarUsuarioAPI2(identi, password, datosOptenidos) {
    fetch(`http://localhost:3000/login/cambiarContrasenaUsuario/${identi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosOptenidos)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos");
      }
    })
    .then(data => {
      if (data.status !== false) {
        // El usuario está registrado como usuario, realiza las acciones necesarias
        console.log("Usuario registrado como usuario");
      } else {
        // El usuario no está registrado como usuario, verifica la siguiente API
        verificarUsuarioAPI3(identi, password, datosOptenidos);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }
  
  function verificarUsuarioAPI3(identi, password, datosOptenidos) {
    fetch(`http://localhost:3000/login/cambiarContrasenaDoctor/${identi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosOptenidos)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos");
      }
    })
    .then(data => {
      if (data.status !== false) {
        // El usuario está registrado como doctor, realiza las acciones necesarias
        console.log("Usuario registrado como doctor");
      } else {
        // El usuario no está registrado en ninguna de las APIs
        Swal.fire({
          title: "Persona no existe en la b
          ase de datos del sistema medico",
          text: "Contraseña o correo incorrecto",
          icon: "warning",
        });
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

document.querySelectorAll('.button').forEach(button => {

  let div = document.createElement('div'),
      letters = button.textContent.trim().split('');

  function elements(letter, index, array) {

      let element = document.createElement('span'),
          part = (index >= array.length / 2) ? -1 : 1,
          position = (index >= array.length / 2) ? array.length / 2 - index + (array.length / 2 - 1) : index,
          move = position / (array.length / 2),
          rotate = 1 - move;

      element.innerHTML = !letter.trim() ? '&nbsp;' : letter;
      element.style.setProperty('--move', move);
      element.style.setProperty('--rotate', rotate);
      element.style.setProperty('--part', part);

      div.appendChild(element);

  }

  letters.forEach(elements);

  button.innerHTML = div.outerHTML;

  button.addEventListener('mouseenter', e => {
      if(!button.classList.contains('out')) {
          button.classList.add('in');
      }
  });

  button.addEventListener('mouseleave', e => {
      if(button.classList.contains('in')) {
          button.classList.add('out');
          setTimeout(() => button.classList.remove('in', 'out'), 950);
      }
  });

  button.addEventListener('click', e => {
      e.preventDefault(); // Evitar que el formulario se envíe
  });

});

 */