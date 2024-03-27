let tablaConsulta = document.getElementById("tablaConsulta");
let arregloPrincipal = [];

//aca estoy llenando la tabla de las consultas
fetch(
  `http://localhost:3000/consultorio/selecionarCitasPorAtender/?estado=Pendiente&nombre=1006`
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((element) => {
      let fechaModi = new Date(element.fechaCita);
      fechaModi = `${fechaModi.getDate()}/${
        fechaModi.getMonth() + 1
      }/${fechaModi.getFullYear()}`;

      let arregloSecundario = [
        element.idCita,
        element.paciente,
        element.nombreMedico,
        fechaModi, // Aquí usamos la fecha modificada
        element.horaCita,
        element.estadoCita,
      ];
      arregloPrincipal.push(arregloSecundario);
    });

    console.log(arregloPrincipal);

    let table = new DataTable("#datatable", {
      responsive: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-CO.json",
      },

      columns: [
        { title: "ID" },
        { title: "Paciente" },
        { title: "Dactor" },
        { title: "Fecha." },
        { title: "Hora" },
        { title: "Estado" },
      ],
      data: arregloPrincipal,
    });

    //aca hago el evento que se va depurar al hacerle click en una columna del datatable
    // Escuchar el evento 'click' en una celda de la tabla
    $("#datatable tbody").on("click", "td", function () {
      // Obtener los datos de la fila correspondiente a la celda clicada
      let rowData = table.row($(this).closest("tr")).data();

      // Hacer algo con los datos, por ejemplo llamar la funcion que le mando el id para poder selecionar el paciente

      func_selecionarCliente(rowData[0]);
    });
  })
  .catch((error) => {
    console.error("Error en la solicitud fetch:", error);
  });

//voy hacer la funcion donde va consumir la API de selecionar el cliente
let datosPaciente = document.getElementById("datosPaciente");
const func_selecionarCliente = (id) => {
  //este va hacer la API para consumir y colocar los datos del Paciente
  fetch("http://localhost:3000/consultorio/selecionarDatosPaciente/" + id)
    .then((date) => {
      return date.json();
    })
    .then((date) => {
      date.forEach((elemen) => {
        let fechaModi = new Date(elemen.fechaNacimientoPqciente);
        fechaModi = `${fechaModi.getDate()}/${
          fechaModi.getMonth() + 1
        }/${fechaModi.getFullYear()}`;

        let descrip = ` <h4>Datos Paciente</h4>
<div class="dato1">
  <div class="form-floating mb-3 datosInput datosInputnombre">
    <input
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
      value="${elemen.nombrePaciente} ${elemen.apellidoPaciente}"
    />
    <label for="floatingInput">Nombre Paciente</label>
  </div>

  </div>
</div>
<div class="dato1">
  <div class="form-floating mb-3 datosInput">
    <input
    value="${elemen.movilPaciente}"
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
    />
    <label for="floatingInput">Telefono</label>
  </div>
  <div class="form-floating mb-3">
    <input
    value="${fechaModi}"
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
    />
    <label for="floatingInput">Fecha Nacimiento</label>
  </div>
</div>

<div class="dato1">
  <div class="form-floating mb-3 datosInput">
    <input
    value="${elemen.epsPaciente}"
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
    />
    <label for="floatingInput">EPS</label>
  </div>
  <div class="form-floating mb-3">
    <input
    value="${elemen.cedulaPaciente}"
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
    />
    <label for="floatingInput">Cedula</label>
  </div>
</div>

<div class="dato1">
  <div class="form-floating mb-3 datosInput datosInputnombre">
    <input
      disabled
      type="email"
      class="form-control"
      id="floatingInput"
      value="${elemen.emailPaciente}"
    />
    <label for="floatingInput">Correro</label>
  </div>

  </div>
  

  <div class="dato1"> 
  <button type="button" class="btn btn-warning">Quitar</button>
  <button type="button" class="btn btn-success">Iniciar</button>


  
  </div>
  
  `;

        datosPaciente.innerHTML = descrip;
      });
    });
  //---------------------------------------------------------------------------

  //voy a sacar la cedula del doctor del localStore

  let datosLocal = window.localStorage;
  let datos = JSON.parse(datosLocal.getItem(1));

  //aca voy a consumir la API donde se va agregar la tabla con las formulas
  let arregloFormula = [];
  //aca voy a llamar donde esta el mensaje de que ninguna Cita selecionada para poder quitarlo de ahy
  let infoDeFormula = document.querySelector(".infoDeFormula");
  infoDeFormula.innerHTML = "";
  fetch(
    `http://localhost:3000/consultorio/selecionarDatosPaciente/?cedula=${id}&dactor=${datos.id}`
  )
    .then((date) => {
      return date.json();
    })
    .then((date) => {
      //aca voy a llenar el arreglo y a declarar la tabla
      date.forEach((element) => {
        let fechaModi = new Date(element.fechaFormula);
        fechaModi = `${fechaModi.getDate()}/${
          fechaModi.getMonth() + 1
        }/${fechaModi.getFullYear()}`;

        let arregloSecundario = [
          element.idFormula,
          fechaModi,
          element.nombrePaciente,
          element.nombreMedico,
        ];
        arregloFormula.push(arregloSecundario);
      });

      console.log(arregloFormula);

      let table = new DataTable("#tableFormulasMedicas", {
        info: false,

        paging: false,
        responsive: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-CO.json",
        },

        columns: [
          { title: "ID" },
          { title: "Fecha Formula" },
          { title: "Paciente" },
          { title: "Doctor." },
        ],
        data: arregloFormula,
      });

      //aca hago el evento que se va depurar al hacerle click en una columna del datatable
      // Escuchar el evento 'click' en una celda de la tabla
      $("#tableFormulasMedicas tbody").on("click", "td", function () {
        // Obtener los datos de la fila correspondiente a la celda clicada
        let rowData = table.row($(this).closest("tr")).data();

        // Hacer algo con los datos, por ejemplo llamar la funcion que le mando el id para poder selecionar el Historial
        // y el detalle formula para mostrat en unas tablas

        alert("hola");
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//aca voy hacer la funcion donde voy a consumir las APIS de DetalleFactura y el Historial
