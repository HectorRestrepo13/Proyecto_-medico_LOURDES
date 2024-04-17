// Obtener el id del usuario del localStorage
   const datos = JSON.parse(window.localStorage.getItem(1));
fetch(`http://localhost:3000/pacientes/selecionarpacienteRechazados/${datos.id}`)
  .then((res) => res.json())
  .then((Programadas) => {
    const miTabla = document.getElementById("datatable");
    Programadas.forEach((Citas) => {
      let fila = `
        <tr>
          <td>${Citas.idCita !== undefined ? Citas.idCita : ""}</td>
          <td>${Citas.fechaCita !== undefined ? Citas.fechaCita.substring(0,10) : ""}</td>
          <td>${Citas.horaCita !== undefined ? Citas.horaCita : ""}</td>
          <td>${Citas.estadoCita !== undefined ? Citas.estadoCita : ""}</td>
          <td>${Citas.paciente_cedulaPaciente !== undefined ? Citas.paciente_cedulaPaciente : ""}</td>
          <td>${Citas.medico_cedulaMedico !== undefined ? Citas.medico_cedulaMedico : ""}</td>
          

          </tr>
      `;
      miTabla.innerHTML += fila;
    });

    // Inicializar DataTables después de insertar los datos
    $("#miTabla").DataTable({
      responsive:true,
      lengthMenu: [5, 10, 15, 50, 100, 250, 500],
      columnDefs: [
        { orderable: false, targets: [4, 5] },
        { searchable: false, targets: [4, 5] },
      ],
      pageLength: 5,
      destroy: true,
      language: {
        lengthMenu: "Mostrar _MENU_ citas pendiente por página",
        zeroRecords: "Ningún citas pendiente encontrado",
        info: "Mostrando _START_ a _END_ citas pendientes de _TOTAL_ ",
        infoEmpty: "Ningún citas pendiente encontrado",
        infoFiltered: "(filtrados desde _MAX_ citas pendientes totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<",
        },
      },
    });
  })
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));

  function verificarExistenciaMedico(cedula) {
    return fetch(`http://localhost:3000/medico/verificarMedico/${cedula}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al buscar médico.");
            }
            return response.json();
        })
        .then((data) => {
            return data.length > 0; // Devuelve true si se encuentra al menos un médico con esa cédula
        })
        .catch((error) => {
            console.error('Error al verificar la existencia del médico:', error);
            return false; // En caso de error, asumimos que el médico no existe
        });
}
function btnEditar(id, fechas, horas, estado, paciente, doctor) {
  Swal.fire({
      title: "Editar cita",
      html: `
      <label for="id" class="text-align">Id de la cita</label>
      <input type="number" id="id" class="swal2-input" placeholder="id" value="${id}" disabled>
      <label for="fechas">Fecha de la cita</label>
      <input type="date" id="fechaCita" class="swal2-input"  name="fechas" value="${fechas}" required>
      <label for="horas">Hora de la cita</label>
      <input type="time" id="horaCita" class="swal2-input" name="horas" value="${horas}">
      <label for="estado">Estado de la cita</label>
      <input type="text" id="estado" class="swal2-input" placeholder="estado" value="${estado}" disabled>
      <label for="paciente">CC del paciente</label>
      <input type="number" id="paciente" class="swal2-input" placeholder="paciente" value="${paciente}" disabled>
      <label for="doctor">CC del doctor</label>
      <input type="number" id="doctor" class="swal2-input" placeholder="doctor" value="${doctor}">
      
          `,
      inputAttributes: {
          autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Actualizar cita",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
          const fecha = document.getElementById("fechaCita").value;
          const hora = document.getElementById("horaCita").value;
          const idPaciente = document.getElementById("paciente").value;
          const idDoctor = document.getElementById("doctor").value;

          console.log("Fecha:", fecha);
          console.log("Hora:", hora);
          console.log("ID Paciente:", idPaciente);
          console.log("ID Doctor:", idDoctor);

          if (!fecha || !hora || !idPaciente || !idDoctor) {
              return Promise.reject("Por favor, complete todos los campos.");
          } else {
              return verificarExistenciaMedico(idDoctor)
                  .then((medicoExiste) => {
                      if (!medicoExiste) {
                          throw new Error("El médico no existe en la base de datos. Verifique la cédula.");
                      }
                      const data = {
                          fechaCita: fecha,
                          horaCita: hora,
                          paciente_cedulaPaciente: idPaciente,
                          medico_cedulaMedico: parseInt(idDoctor)
                      };
                      return fetch(`http://localhost:3000/cita/update/${id}`, {
                          method: "PUT",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify(data),
                      })
                      .then((response) => {
                          if (!response.ok) {
                              throw new Error("Error al actualizar el dato del elemento.");
                          }
                          Swal.fire({
                              title: "¡Éxito!",
                              text: "La edición se ha completado correctamente.",
                              icon: "success",
                          }).then(() => {
                              window.location.assign("http://127.0.0.1:5501/Cliente/citasRechazadas.html");
                          });
                      })
                      .catch((error) => {
                          console.error('Error al actualizar la cita:', error);
                          Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Hubo un error al actualizar la cita. Por favor, inténtelo de nuevo más tarde.'
                          });
                      });
                  })
                  .catch((error) => {
                      console.error('Error al verificar la existencia del médico:', error);
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: error.message
                      });
                  });
          }
      },
  });
}
