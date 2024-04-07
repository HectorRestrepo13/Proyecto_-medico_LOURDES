document.addEventListener("DOMContentLoaded", function() {
  let btnDoctor = document.getElementById("btnDoctor");
let btnUsuario = document.getElementById("btnUsuario");
let btnPaciente=document.getElementById("btnPaciente");




btnDoctor.addEventListener("click", ()=>{
  let txtEmail = document.getElementById("txtEmail").value;
let txtContra = document.getElementById("txtContra").value;
  console.log("La contrase;a es:",txtContra,"El gmail es:",txtEmail)
  if (txtContra.length > 0 && txtEmail.length > 0) {
   
      fetch(
        `http://localhost:3000/login/selecionarUsuarioMedico?emailMedico=${txtEmail}&password=${txtContra}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error al obtener los datos');
          }
        })
        .then((date) => {
          if (date.length > 0) {
            let datosLocal = window.localStorage;

            let datos = {
              id: date[0].cedulaMedico,
              nombre: date[0].nombreMedico,
              apellido: date[0].apellidoMedico,
              especialidad: date[0].especialidadMedico,
            };

            datosLocal.setItem(1, JSON.stringify(datos));
            window.location.href = "indexConsultorio.html";
          } else {
            Swal.fire({
              title: "Doctor no existe",
              text: "Contraseña o correo incorrecto",
              icon: "warning",
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }else{
        Swal.fire({
          title: "Faltan Casillas por llenar",
          text: "LLena las casillas para poder iniciar",
          icon: "warning",
        });
      }
    })
        btnPaciente.addEventListener("click", ()=>{
          let txtEmail = document.getElementById("txtEmail").value;
let txtContra = document.getElementById("txtContra").value;
          if (txtContra.length > 0 && txtEmail.length > 0) {
      fetch(
        `http://localhost:3000/login/selecionarPaciente/${txtEmail}/${txtContra}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error al obtener los datos');
          }
        })
        .then((date) => {
          if (date.length > 0) {
            let datosLocal = window.localStorage;

            let datos = {
              id: date[0].cedulaPaciente,
              nombre: date[0].nombrePaciente,
              apellido: date[0].apellidoPaciente,
            };

            datosLocal.setItem(1, JSON.stringify(datos));
            window.location.href = "pacientes.html";
          } else {
            Swal.fire({
              title: "Paciente no existe",
              text: "Contraseña o correo incorrecto",
              icon: "warning",
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }else{
        Swal.fire({
          title: "Faltan Casillas por llenar",
          text: "LLena las casillas para poder iniciar",
          icon: "warning",
        });
      }
      })
      btnUsuario.addEventListener("click", ()=>{
        let txtEmail = document.getElementById("txtEmail").value;
let txtContra = document.getElementById("txtContra").value;
        if (txtContra.length > 0 && txtEmail.length > 0) {
      fetch(
        `http://localhost:3000/login/selecionarUsuario/${txtEmail}/${txtContra}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error al obtener los datos');
          }
        })
        .then((date) => {
          if (date.length > 0) {
            let datosLocal = window.localStorage;

            let datos = {
              id: date[0].cedulaUser,
              nombre: date[0].userName,
              apellido: date[0].password,
            };

            datosLocal.setItem(1, JSON.stringify(datos));
            window.location.href = "pacientes.html";
          } else {
            Swal.fire({
              title: "Usuario no existe",
              text: "Contraseña o correo incorrecto",
              icon: "warning",
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } else {
        Swal.fire({
          title: "Faltan Casillas por llenar",
          text: "LLena las casillas para poder iniciar",
          icon: "warning",
        });
    }
})
 



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