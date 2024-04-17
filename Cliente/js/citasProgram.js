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


/* //Programar fecha
class Calendar {
  constructor(id) {
      this.cells = [];
      this.selectedDate = null;
      this.currentMonth = moment();
      this.elCalendar = document.getElementById(id);
      this.showTemplate();
      this.elGridBody = this.elCalendar.querySelector('.grid__body');
      this.elMonthName = this.elCalendar.querySelector('.month-name');
      this.showCells();

         // Obtener las citas existentes del médico seleccionado
    this.obtenerCitasExistentes();
  }

  showTemplate() {
      this.elCalendar.innerHTML = this.getTemplate();
      this.addEventListenerToControls();
  }

  getTemplate() {
      let template = `
          <div class="calendar__header">
              <button type="button" class="control control--prev">&lt;</button>
              <span class="month-name">dic 2019</span>
              <button type="button" class="control control--next">&gt;</button>
          </div>
          <div class="calendar__body">
              <div class="grid">
                  <div class="grid__header">
                      <span class="grid__cell grid__cell--gh">Lun</span>
                      <span class="grid__cell grid__cell--gh">Mar</span>
                      <span class="grid__cell grid__cell--gh">Mié</span>
                      <span class="grid__cell grid__cell--gh">Jue</span>
                      <span class="grid__cell grid__cell--gh">Vie</span>
                      <span class="grid__cell grid__cell--gh">Sáb</span>
                      <span class="grid__cell grid__cell--gh">Dom</span>
                  </div>
                  <div class="grid__body">

                  </div>
              </div>
          </div>
      `;
      return template;
  }

  addEventListenerToControls() {
      let elControls = this.elCalendar.querySelectorAll('.control');
      elControls.forEach(elControl => {
          elControl.addEventListener('click', e => {
              let elTarget = e.target;
              if (elTarget.classList.contains('control--next')) {
                  this.changeMonth(true);
              } else {
                  this.changeMonth(false);
              }
              this.showCells();
          });
      });
  }

  changeMonth(next = true) {
      if (next) {
          this.currentMonth.add(1, 'months');
      } else {
          this.currentMonth.subtract(1, 'months');
      }
  }
  obtenerCitasExistentes() {
    const selectDoctor = document.getElementById('selectDoctor');
    const cedulaDoctor = selectDoctor.value.split('|')[0];

    fetch(`http://localhost:3000/paciente/MostrarCitas/${cedulaDoctor}`)
      .then(response => response.json())
      .then(citas => {
        // Almacenar las fechas de las citas existentes en un conjunto
        this.citasExistentes = new Set(citas.map(cita => cita.fechaCita));

        // Actualizar la visualización del calendario
        this.showCells();
      })
      .catch(error => console.error('Error al obtener las citas existentes:', error));
  }

  showCells() {
      this.cells = this.generateDates(this.currentMonth);
      if (this.cells === null) {
          console.error('No fue posible generar las fechas del calendario.');
          return;
      }
      // Código existente
const selectDoctor = document.getElementById('selectDoctor');
selectDoctor.addEventListener('change', () => {
  const calendar = new Calendar('calendar');
});

      this.elGridBody.innerHTML = '';
      let templateCells = '';
      let disabledClass = '';
      for (let i = 0; i < this.cells.length; i++) {
          disabledClass = '';
          if (!this.cells[i].isInCurrentMonth) {
              disabledClass = 'grid__cell--disabled';
          }
          // <span class="grid__cell grid__cell--gd grid__cell--selected">1</span>
          templateCells += `
              <span class="grid__cell grid__cell--gd ${disabledClass}" data-cell-id="${i}">
                  ${this.cells[i].date.date()}
              </span>
          `;
      }
      this.elMonthName.innerHTML = this.currentMonth.format('MMM YYYY');
      this.elGridBody.innerHTML = templateCells;
      this.addEventListenerToCells();
  }

  generateDates(monthToShow = moment()) {
      if (!moment.isMoment(monthToShow)) {
          return null;
      }
      let dateStart = moment(monthToShow).startOf('month');
      let dateEnd = moment(monthToShow).endOf('month');
      let cells = [];

      // Encontrar la primer fecha que se va a mostrar en el calendario
      while (dateStart.day() !== 1) {
          dateStart.subtract(1, 'days');
      }

      // Encontrar la última fecha que se va a mostrar en el calendario
      while (dateEnd.day() !== 0) {
          dateEnd.add(1, 'days');
      }

      // Genera las fechas del grid
      do {
          cells.push({
              date: moment(dateStart),
              isInCurrentMonth: dateStart.month() === monthToShow.month()
          });
          dateStart.add(1, 'days');
      } while (dateStart.isSameOrBefore(dateEnd));

      return cells;
  }

  addEventListenerToCells() {
      let elCells = this.elCalendar.querySelectorAll('.grid__cell--gd');
      elCells.forEach(elCell => {
          elCell.addEventListener('click', e => {
              let elTarget = e.target;
              if (elTarget.classList.contains('grid__cell--disabled') || elTarget.classList.contains('grid__cell--selected')) {
                  return;
              }
              // Deselecionar la celda anterior
              let selectedCell = this.elGridBody.querySelector('.grid__cell--selected');
              if (selectedCell) {
                  selectedCell.classList.remove('grid__cell--selected');
              }
              // Selecionar la nueva celda
              elTarget.classList.add('grid__cell--selected');
              this.selectedDate = this.cells[parseInt(elTarget.dataset.cellId)].date;
              // Lanzar evento change
              this.elCalendar.dispatchEvent(new Event('change'));
          });
      });
  }

  getElement() {
      return this.elCalendar;
  }

  value() {
      return this.selectedDate;
  }
} */