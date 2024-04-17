document.addEventListener("DOMContentLoaded", function() {
    const nombre = document.getElementById("nombrePaciente");
    const apellido = document.getElementById("apellidoPaciente");
    const fechaFinal = document.getElementById("fechaFinal");
    const telefono = document.getElementById("telefono");
    const email = document.getElementById("email");
    const eps = document.getElementById("eps");
    const id=document.getElementById("identiPaciente");

      // Obtener el id del usuario del localStorage
      const datos = JSON.parse(window.localStorage.getItem(1));
    
    //Para el historial
    fetch(`http://localhost:3000/paciente/traerHistorial/historial/${datos.id}`)
      .then((res) => res.json())
      .then((Programadas) => {
        const miTabla = document.getElementById("datatable1");
        Programadas.forEach((historial) => {
          let fila = `
            <tr>
              <td>${historial.idHistorial !== undefined ? historial.idHistorial : ""}</td>
              <td>${historial.sintomas !== undefined ? historial.sintomas : ""}</td>
              <td>${historial.descripcion !== undefined ? historial.descripcion : ""}</td>
            
              </tr>
          `;
          miTabla.innerHTML += fila;
        });
    
        // Inicializar DataTables después de insertar los datos
        $("#miTabla1").DataTable({
          responsive:true,
          lengthMenu: [5, 10, 15, 50, 100, 250, 500],
          columnDefs: [
            { orderable: false, targets: [1, 2] },
            { searchable: false, targets: [1, 2] },
          ],
          pageLength: 5,
          destroy: true,
          language: {
            lengthMenu: "Mostrar _MENU_ Historial pendiente por página",
            zeroRecords: "Ningún Historial pendiente encontrado",
            info: "Mostrando _START_ a _END_ Historiales pendientes de _TOTAL_ ",
            infoEmpty: "Ningún Historial pendiente encontrado",
            infoFiltered: "(filtrados desde _MAX_ Historiales pendientes totales)",
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
    
    
    //Para la formula medica
    
    
    
    //Para el historial
    fetch(`http://localhost:3000/paciente/traerFormula/formula/${datos.id}`)
      .then((res) => res.json())
      .then((Programadas) => {
        const miTabla = document.getElementById("datatable2");
        Programadas.forEach((formula) => {
          let fila = `
            <tr>
              <td>${formula.idFormula !== undefined ? formula.idFormula : ""}</td>
              <td>${formula.fechaFormula !== undefined ? formula.fechaFormula : ""}</td>
              <td>${formula.paciente_cedulaPaciente !== undefined ? formula.paciente_cedulaPaciente : ""}</td>
              <td>${formula.medico_cedulaMedico !== undefined ? formula.medico_cedulaMedico : ""}</td>
              </tr>
          `;
          miTabla.innerHTML += fila;
        });
    
        // Inicializar DataTables después de insertar los datos
        $("#miTabla2").DataTable({
          responsive:true,
          lengthMenu: [5, 10, 15, 50, 100, 250, 500],
          columnDefs: [
            { orderable: false, targets: [2, 3] },
            { searchable: false, targets: [2, 3] },
          ],
          pageLength: 5,
          destroy: true,
          language: {
            lengthMenu: "Mostrar _MENU_ Historial pendiente por página",
            zeroRecords: "Ningún Historial pendiente encontrado",
            info: "Mostrando _START_ a _END_ Historiales pendientes de _TOTAL_ ",
            infoEmpty: "Ningún Historial pendiente encontrado",
            infoFiltered: "(filtrados desde _MAX_ Historiales pendientes totales)",
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
    
      //Para el detalle formula
    fetch(`http://localhost:3000/paciente/traerDetalleFormula/detalleFormula/${datos.id}`)
    .then((res) => res.json())
    .then((Programadas) => {
      const miTabla = document.getElementById("datatable3");
      Programadas.forEach((detalleFormula) => {
        let fila = `
          <tr>
            <td>${detalleFormula.idDetalle !== undefined ? detalleFormula.idDetalle : ""}</td>
            <td>${detalleFormula.cantidadDetalle !== undefined ? detalleFormula.cantidadDetalle : ""}</td>
            <td>${detalleFormula.posologiaDetalle !== undefined ? detalleFormula.posologiaDetalle : ""}</td>
            <td>${detalleFormula.descripcionItem !== undefined ? detalleFormula.descripcionItem : ""}</td>
            </tr>
        `;
        miTabla.innerHTML += fila;
      });
    
      // Inicializar DataTables después de insertar los datos
      $("#miTabla3").DataTable({
        responsive:true,
        lengthMenu: [5, 10, 15, 50, 100, 250, 500],
        columnDefs: [
          { orderable: false, targets: [2, 3] },
          { searchable: false, targets: [2, 3] },
        ],
        pageLength: 5,
        destroy: true,
        language: {
          lengthMenu: "Mostrar _MENU_ detalle formula pendiente por página",
          zeroRecords: "Ningún detalle formula pendiente encontrado",
          info: "Mostrando _START_ a _END_ detalle formulas pendientes de _TOTAL_ ",
          infoEmpty: "Ningún detalle formula pendiente encontrado",
          infoFiltered: "(filtrados desde _MAX_ detalle formulas pendientes totales)",
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
    
    fetch(`http://localhost:3000/paciente/traerDatosPaciente/historial/${datos.id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw "Error al obtener los datos del paciente";
      })
      .then(data => {
        if (data.length > 0) {
          // Asignar los valores a los campos de entrada
          id.value = data[0].cedulaPaciente;
          nombre.value = data[0].nombrePaciente;
          apellido.value = data[0].apellidoPaciente;
          email.value = data[0].emailPaciente;
          telefono.value = data[0].telefonoPaciente;
          eps.value = data[0].epsPaciente;
        
    
          // Suponiendo que la fecha viene en formato 'YYYY-MM-DD'
          const fechaObj = new Date(data[0].fechaNacimientoPqciente);
          console.log(data[0].fechaNacimientoPqciente);
    
          // Asignar la fecha al campo de entrada de tipo 'date'
          fechaFinal.value = fechaObj.toISOString().split('T')[0];
    
          id.disabled = true;
    
        } else {
          console.log("No hay datos del paciente. Verifica la cédula si se encuentra bien escrita sin puntos y comas");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    
  });



