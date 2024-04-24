document.addEventListener("DOMContentLoaded", function() {
    let CambiarPassword = document.getElementById("btnCambiarContrasena");

    CambiarPassword.addEventListener("click", () => {
        let txtIdenti = document.getElementById("txtIdenti").value;
        let txtContraNueva = document.getElementById("txtContraNueva").value;

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

    function verificarUsuario(identi, password) {
        fetch(`http://localhost:3000/login/cambiarContrasenaUsuarios/${identi}/${password}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            console.log(data);
          
            if (data.status === true) {
                Swal.fire({
                    title: "Contraseña actualizada correctamente",
                    text: "Se ha actualizado la contraseña exitosamente",
                    icon: "success",
                }).then(() => {
                    // Redireccionar al usuario al login
                    window.location.href = "http://127.0.0.1:5501/Cliente/Login.html";
                });
            } else {
                Swal.fire({
                    title: "Persona no existe en la base de datos del sistema medico",
                    text: "Contraseña o correo incorrecto",
                    icon: "warning",
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
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

})