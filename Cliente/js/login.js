let btnDoctor = document.getElementById("btnDoctor");
let btnUsuario = document.getElementById("btnUsuario");
let rolSelecionado = document.getElementById("rolSelecionado");

let btnIniciarSession = document.getElementById("btnIniciarSession");

btnDoctor.addEventListener("click", () => {
  btnDoctor.style.backgroundColor = "#46D7F3";
  btnDoctor.style.color = "black";
  rolSelecionado.value = "doctor";

  btnUsuario.style.backgroundColor = "white";
  btnUsuario.style.color = "#46D7F3";
});

btnUsuario.addEventListener("click", () => {
  btnUsuario.style.backgroundColor = "#46D7F3";
  btnUsuario.style.color = "black";
  rolSelecionado.value = "usuario";

  btnDoctor.style.backgroundColor = "white";
  btnDoctor.style.color = "#46D7F3";
});

//aca voy hacer la funcion que se va ejecutar al darle click en iniciar
//para consumir la API

btnIniciarSession.addEventListener("click", () => {
  let txtEmail = document.getElementById("txtEmail").value;
  let txtContra = document.getElementById("txtContra").value;

  if (txtContra.length > 0 && txtEmail.length > 0) {
    if (rolSelecionado.value == "Doctor") {
      fetch(
        `http://localhost:3000/login/selecionarUsuarioMedico?emailMedico=${txtEmail}&password=${txtContra}`
      )
        .then((date) => {
          if (date.ok) {
            return date.json();
          }
        })
        .then((date) => {
          if (date.status == true) {
          } else {
            Swal.fire({
              title: "Usuario no existe",
              text: "Contraseña o correo incorrecto",
              icon: "warning",
            });
          }
        });
    } else {
      fetch(
        `http://localhost:3000/login/selecionarUsuariotrabajador?emailUser=${txtEmail}&password=${txtContra}`
      )
        .then((date) => {
          if (date.ok) {
            return date.json();
          }
        })
        .then((date) => {
          if (date.status == true) {
            alert("bien");
          } else {
            Swal.fire({
              title: "Usuario no existe",
              text: "Contraseña o correo incorrecto",
              icon: "warning",
            });
          }
        });
    }
  } else {
    Swal.fire({
      title: "Faltan Casillas por llenar",
      text: "LLena las casillas para poder iniciar",
      icon: "warning",
    });
  }
});
