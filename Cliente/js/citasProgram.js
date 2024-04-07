      // Obtener el id del usuario del localStorage
      const datos = JSON.parse(window.localStorage.getItem(1));
fetch(`http://localhost:3000/pacientes/selecionarpaciente/${datos.id}`)
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

  fetch("http://localhost:3000/medico/buscarEspecialidadMedico")
  .then((res) => res.json())
  .then((data) => {
    const selectCitas = document.getElementById("selectCitas");
    const especialidadesAgregadas = new Set(); // Utilizar un conjunto para almacenar las especialidades añadidas

    // Limpiar las opciones existentes
    selectCitas.innerHTML = "";

    // Agregar la opción "Seleccione una especialidad"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una especialidad";
    selectCitas.appendChild(defaultOption);

    // Agregar las opciones de especialidades únicas
    data.forEach((especialidad) => {
      const especialidadMedico = especialidad.especialidadMedico;
      if (!especialidadesAgregadas.has(especialidadMedico)) {
        const option = document.createElement("option");
        option.value = especialidadMedico;
        option.textContent = especialidadMedico;
        selectCitas.appendChild(option);
        especialidadesAgregadas.add(especialidadMedico); // Agregar la especialidad al conjunto
      }
    });
  })
  .catch((error) => console.error("Error al cargar las especialidades:", error));






  // Obtener referencia a los selectores
const selectEspecialidad = document.getElementById('selectCitas');

// Evento que se activa cuando se cambia la especialidad
selectEspecialidad.addEventListener('change', () => {
    const selectDoctor = document.getElementById('selectDoctor');
    // Obtener el valor seleccionado de la especialidad
    const especialidadSeleccionada = selectEspecialidad.value;

     // Vaciar el selector de doctores
     selectDoctor.innerHTML = ''; // Vacía todas las opciones existentes
    console.log(especialidadSeleccionada);

    // Realizar una solicitud al servidor para obtener los doctores con esa especialidad
    fetch('http://localhost:3000/medico/buscarMedico/' + especialidadSeleccionada, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
     
        // Limpiar el selector de doctores
        selectDoctor.innerHTML = ''; // Añadida esta línea

        // Agregar las opciones de doctores al selector
        data.forEach(doctor => {
          const option = document.createElement('option');
          option.value = doctor.cedulaMedico+ '|' + doctor.nombreMedico; // Concatena cédula y nombre
          option.textContent = doctor.nombreMedico;
          selectDoctor.appendChild(option);
      });
    })
    .catch((error) => console.error('Error al cargar los doctores:', error));
});
  
function funcion_gubuttonrdbuttonrCita() {
  const fecha = document.getElementById("fechaCita").value;
  const hora = document.getElementById("horaCita").value;
  const cedulaPaciente = document.getElementById("cedulaPaciente").value;
  const cedulaDoctor = document.getElementById("selectDoctor").value;

  // Verificar si alguno de los campos está vacío
  if (!fecha || !hora || !cedulaPaciente || !cedulaDoctor) {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, complete todos los campos.'
      });
      return false; // Detener el envío del formulario si algún campo está vacío
  } else {
      let data = {  
          fechaCita: fecha,
          horaCita: hora,
          paciente_cedulaPaciente: cedulaPaciente,
          medico_cedulaMedico: parseInt(cedulaDoctor)
      };

      return fetch("http://localhost:3000/cita/create", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Error al guardar los datos.");
          }
          Swal.fire({
              title: "¡Éxito!",
              text: "Se agregó correctamente.",
              icon: "success",
          }).then(() => {
              window.location.assign("http://127.0.0.1:5501/Cliente/citasProgramadas.html");
          });
      })
      .catch((error) => {
          console.error('Error al agregar la cita:', error);
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Porfavor verifica el numero de identificacion que ingreso.'
          });
      });
  }
}
