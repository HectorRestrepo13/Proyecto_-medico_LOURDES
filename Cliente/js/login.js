document.addEventListener("DOMContentLoaded", function () {
  let btnIniciarSesion = document.getElementById("btnIniciarSesion");

  btnIniciarSesion.addEventListener("click", () => {
    let txtEmail = document.getElementById("txtEmail").value;
    let txtContra = document.getElementById("txtContra").value;

    if (txtContra.length === 0 || txtEmail.length === 0) {
      Swal.fire({
        title: "Faltan Casillas por llenar",
        text: "Llena las casillas para poder iniciar",
        icon: "warning",
      });
      return;
    }

    verificarUsuario(txtEmail, txtContra);
  });

  function verificarUsuario(email, password) {
    Promise.all([
      fetch(
        `http://localhost:3000/login/selecionarUsuarioMedico/${email}/${password}`
      ),
      fetch(
        `http://localhost:3000/login/selecionarPaciente/${email}/${password}`
      ),
      fetch(
        `http://localhost:3000/login/selecionarUsuario/${email}/${password}`
      ),
      fetch(`http://localhost:3000/login/selecionarAdmin/${email}/${password}`),
    ])
      .then((responses) => {
        return Promise.all(
          responses.map((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Error al obtener los datos");
            }
          })
        );
      })
      .then((data) => {
        let usuarioEncontrado = false;
        data.forEach((usuarios) => {
          if (usuarios.length > 0) {
            usuarioEncontrado = true;
            let datosLocal = window.localStorage;
            let datos = {};

            if (usuarios[0].cedulaMedico !== undefined) {
              datos = {
                id: usuarios[0].cedulaMedico,
                nombre: usuarios[0].nombreMedico,
                apellido: usuarios[0].apellidoMedico,
                especialidad: usuarios[0].especialidadMedico,
              };
              window.location.href = "indexConsultorio.html"; // Cambiar la redirección según el tipo de usuario
            } else if (usuarios[0].cedulaPaciente !== undefined) {
              datos = {
                id: usuarios[0].cedulaPaciente,
                nombre: usuarios[0].nombrePaciente,
                apellido: usuarios[0].apellidoPaciente,
              };
              window.location.href = "pacientes.html"; // Cambiar la redirección según el tipo de usuario
            } else if (usuarios[0].cedulaUser !== undefined) {
              datos = {
                id: usuarios[0].cedulaUser,
                nombre: usuarios[0].userName,
                apellido: usuarios[0].password,
              };
              console.log("Aca van los usuarios");
            } else {
              datos = {
                id: usuarios[0].identificacionAdmin,
                nombre: usuarios[0].nombreAdmin,
                apellido: usuarios[0].ApellidoAdmin,
              };
              window.location.href = "./admin/formularioAdmin.html";
            }

            datosLocal.setItem(1, JSON.stringify(datos));
          }
        });

        if (!usuarioEncontrado) {
          Swal.fire({
            title: "Persona no existe en la base de datos del sistema medico",
            text: "Contraseña o correo incorrecto",
            icon: "warning",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  document.querySelectorAll(".button").forEach((button) => {
    let div = document.createElement("div"),
      letters = button.textContent.trim().split("");

    function elements(letter, index, array) {
      let element = document.createElement("span"),
        part = index >= array.length / 2 ? -1 : 1,
        position =
          index >= array.length / 2
            ? array.length / 2 - index + (array.length / 2 - 1)
            : index,
        move = position / (array.length / 2),
        rotate = 1 - move;

      element.innerHTML = !letter.trim() ? "&nbsp;" : letter;
      element.style.setProperty("--move", move);
      element.style.setProperty("--rotate", rotate);
      element.style.setProperty("--part", part);

      div.appendChild(element);
    }

    letters.forEach(elements);

    button.innerHTML = div.outerHTML;

    button.addEventListener("mouseenter", (e) => {
      if (!button.classList.contains("out")) {
        button.classList.add("in");
      }
    });

    button.addEventListener("mouseleave", (e) => {
      if (button.classList.contains("in")) {
        button.classList.add("out");
        setTimeout(() => button.classList.remove("in", "out"), 950);
      }
    });

    button.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar que el formulario se envíe
    });
  });
});
