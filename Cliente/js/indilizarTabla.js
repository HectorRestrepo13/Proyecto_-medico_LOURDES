let tablaConsulta = document.getElementById("tablaConsulta");

// hago una funcion para llenar  la tabla de las consultas le mando el id Del medico y el estado que quiere
let localStor = window.localStorage;
let cedulaMedico1 = JSON.parse(localStor.getItem(1));
cedulaMedico1 = cedulaMedico1.id;
const func_llenarTablaConsultasCitas = (cedula, estado) => {
  let arregloPrincipal = [];
  fetch(
    `http://localhost:3000/consultorio/selecionarCitasPorAtender/?estado=${estado}&nombre=${cedula}`
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
        info: false,

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

      // -------------------------------------------------------------------------------------------------

      //aca hago el evento que se va depurar al hacerle click en una columna del datatable
      // Escuchar el evento 'click' en una celda de la tabla
      $("#datatable tbody").on("click", "td", function () {
        // Obtener los datos de la fila correspondiente a la celda clicada
        let rowData = table.row($(this).closest("tr")).data();

        // Hacer algo con los datos, por ejemplo llamar la funcion que le mando el id para poder selecionar el paciente
        // y tambien para llenar la tabla del formulario

        //antes de llamar la funcion voy a reescribir las tablas por si depronto ya tienen datos entonces que no alla error
        func_reescribirTablas();
        func_selecionarCliente(rowData[0], rowData[3], rowData[5]);
      });
    })
    .catch((error) => {
      console.error("Error en la solicitud fetch:", error);
    });
};

// -----------------------------

// llamo la funcion para que se ejecute apenas se inicie
func_llenarTablaConsultasCitas(parseInt(cedulaMedico1), "Pendiente");
// ---------------------------------------
//voy hacer la funcion donde va consumir la API de selecionar el cliente y selecionar el formulario
let datosPaciente = document.getElementById("datosPaciente");
const func_selecionarCliente = (id, fecha, estado) => {
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
<input type="text" value="${id}" id="idCedulaPaciente" hidden>

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
      id="cedulaPaciente"
    />
    <label for="floatingInput">Cedula</label>
  </div>
</div>


<div class="dato1">
  <div class="form-floating mb-3 datosInput">
    <input
    value="${fecha}"
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
    />
    <label for="floatingInput">Fecha Cita</label>
  </div>
  <div class="form-floating mb-3">
    <input
    value="${estado}"
      disabled
      type="text"
      class="form-control"
      id="floatingInput"
    />
    <label for="floatingInput">Estado</label>
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
  <button  onclick="func_reescribirTablas2()" type="button" class="btn btn-warning">Quitar</button>
  <button id="btnIniciarFormulario"  type="button"
  
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
  data-bs-whatever="@getbootstrap"
  onclick="func_selecionarMedicamentos()" class="btn btn-success">Iniciar</button>

<!--- aca va ir el modal con todos los inpus ------->
<div
class="modal fade"
id="exampleModal"
tabindex="-1"
aria-labelledby="exampleModalLabel"
aria-hidden="true"
>
<div class="modal-dialog modal-xl">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">
        Formulario Medico
      </h1>
      <button
      style="  width: 50px;
      "
        type="button"
        class="btn-close btn"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <form>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <h1>Medicamentos a Resetar</h1>
            </div>

            <div class="mb-3">
              <label
                for="recipient-name"
                class="col-form-label"
                >Formula DE como Consumirlo:</label
              >
              <textarea
                class="form-control"
                id="formulaConsumir"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label"
                >Medicamento:</label
              >

              <!-- aca va el select-->
              <div class="selectorMedicamentos">
                <input
                  id="idMedica"
                  class="selectMedicamentos"
                  type="text"
                  list="opciones"
                  placeholder="Medicamento"
                />

                <datalist id="opciones"> </datalist>

                <input
                  class="selectMedicamentos"
                  id="cantidadMedicamento"
                  type="number"
                  placeholder="Selecione la cantidad"
                />
              </div>
            </div>
            <!---------------------------------------------->
            <!-- aca voy agregar el boton para que se envie a la tabla-->
            <div class="mb-3">
              <button
                onclick="func_guardarMedicamentosEnLaTabla()"
                type="button"
                class="btn btn-primary botonEnviar"
              >
                Guardar
              </button>
            </div>

            <!-- aca voy a poner los otros inpus para los sintomas -->
            <div class="mb-3">
              <h1>Historial Clinico</h1>
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label"
                >Sintomas:</label
              >

              <input
                id="sintomas"
                class="selectMedicamentos2"
                type="text"
                placeholder="Sintomas"
              />
            </div>

            <div class="mb-3">
              <label
                for="recipient-name"
                class="col-form-label"
                >Descripcion:</label
              >

              <textarea
                class="form-control"
                id="descripcionSintomas"
              ></textarea>
            </div>

            <div class="mb-3">
              <button
                onclick="func_guardarSintomasEnlaTabla()"
                type="button"
                class="btn btn-primary botonEnviar"
              >
                Guardar
              </button>
            </div>
            <!---------------------------------------------------------------->
          </div>
          <div class="col-6">
            <div class="tituloPrincipal">
              <h1>Medicamentos Disponibles</h1>
            </div>
            <!-- aca voy a colocar la tabla donde se va mostrar los productos disponibles-->
            <div class="acaTabla">
              <table class="table tablasFormulas">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Medicamento</th>
                    <th>Existencia</th>
                  </tr>
                </thead>
                <tbody
                  class="table-group-divider"
                  id="tablaProductos"
                ></tbody>
              </table>
            </div>

            <!-------------------------------------------------------------->
            <!-- aca voy hacer la tabla de los medicamentos resetados-->
            <div class="tituloPrincipal">
              <h1>Medicamentos Resetados</h1>
            </div>
            <div class="acaTabla">
              <table class="table tablasFormulas">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Medicamento</th>
                    <th>Posologia</th>
                    <th>Cantidad</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody
                  class="table-group-divider"
                  id="tablaMedicamentoResetados"
                ></tbody>
              </table>
            </div>

            <!-------------------------------------->

            <!-- aca voy a colocar la tabla donde van a ir los sintomas -->

            <div class="tituloPrincipal">
              <h1>Sintomas del Paciente</h1>
            </div>
            <div class="acaTabla">
              <table class="table tablasFormulas">
                <thead>
                  <tr>
                    <th>Sintoma</th>
                    <th>Descripcion</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody
                  class="table-group-divider"
                  id="tablaSintomasPaciente"
                ></tbody>
              </table>
            </div>

            <!------------------------------------------------------------------->
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        Cerrar
      </button>
      <button
        onclick="func_insertarFormularioAlaBaseDatos()"
        type="button"
        class="btn btn-primary"
      >
        Guardar
      </button>
    </div>
  </div>
</div>
</div>

<!----------------------------------------------------------->
  
  </div>
  
  
  `;

        datosPaciente.innerHTML = descrip;
      });

      // aca hago si estado es confirmado desactivo el boton
      if (estado == "Confirmado") {
        let btnIniciarFormulario = document.getElementById(
          "btnIniciarFormulario"
        );
        btnIniciarFormulario.disabled = true;
      }
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

        func_llenarTablasDetalleYhistorial(rowData[0]);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//aca voy hacer la funcion donde voy a consumir las APIS de DetalleFactura y el Historial

const func_llenarTablasDetalleYhistorial = (idFormula) => {
  //aca voy a quitar el mensaje de alert
  let infoHistorial = document.querySelector(".infoHistorial");
  infoHistorial.innerHTML = "";
  //----------------------------------------------------------
  //aca voy a rescribir la tabla
  let etiquetaTablaHistorial = document.querySelector(
    ".etiquetaTablaHistorial"
  );
  etiquetaTablaHistorial.innerHTML = `<table
  id="tableHistorial"
  class="table table-striped table-hover"
  style="width: 100%"
>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table>`;
  //-----------------------------
  // aca voy a consumir la APi del Historial
  let arregloHistorial = [];
  fetch(
    "http://localHost:3000/consultorio/selecionarDatosHistorial/" + idFormula
  )
    .then((date) => {
      return date.json();
    })
    .then((date) => {
      // verefico primero si tiene datos el JSON que devolvio

      if (date.length > 0) {
        //aca voy a llenar la tabla
        date.forEach((element) => {
          let arregloSecundario = [
            element.idHistorial,
            element.sintoma,
            element.descripcion,
          ];
          arregloHistorial.push(arregloSecundario);
        });

        let table = new DataTable("#tableHistorial", {
          info: false,

          paging: false,
          responsive: true,
          language: {
            url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-CO.json",
          },
          layout: {
            topStart: {
              buttons: {
                buttons: [
                  {
                    extend: "copy",
                    text: '<i class="bi bi-copy"></i>',
                    titleAttr: "Copiar",
                    className: "btn btn-secondary",
                  },
                  {
                    extend: "excel",
                    text: '<i class="bi bi-file-earmark-excel"></i>',
                    titleAttr: "Importar a excel",
                    className: "btn btn-success",
                  },
                  {
                    extend: "pdf",
                    text: '<i class="bi bi-filetype-pdf"></i>',
                    titleAttr: "Importar a pdf",
                    className: "btn btn-danger",
                  },
                  {
                    extend: "print",
                    text: '<i class="bi bi-printer-fill"></i>',
                    titleAttr: "Imprimir",
                    className: "btn btn-info",
                  },
                ],
              },
            },
          },
          columns: [
            { title: "ID" },
            { title: "Sintomas" },
            { title: "Descripcion" },
          ],
          data: arregloHistorial,
        });
      } else {
        infoHistorial.innerHTML = `<div class="alert alert-dark" role="alert">
  No tiene Ningun Historial Clinico!
</div>`;
      }
    })
    .catch((error) => {
      console.log("verificar el API del historial " + error);
    });
  //--------------------------------------------------------------------------------
  // aca voy a eliminar el infoDetalleFormula
  let infoDetalleFormula = document.querySelector(".infoDetalleFormula");
  infoDetalleFormula.innerHTML = "";
  //-----------------------------------------
  // aca voy a reescribir la tabla
  let etiquetaTablaDetalleFormula = document.querySelector(
    ".etiquetaTablaDetalleFormula"
  );
  etiquetaTablaDetalleFormula.innerHTML = ` <table
  id="tableDetalleFormula"
  class="table table-striped table-hover"
  style="width: 100%"
>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table>`;
  //-----------------------------------------------------------------
  // aca voy a consumir la API de detalle Formula
  let arregloDetalleFormula = [];
  fetch(
    "http://localHost:3000/consultorio/selecionarDetalleFormula/" + idFormula
  )
    .then((date) => {
      return date.json();
    })
    .then((date) => {
      if (date.length > 0) {
        //aca voy a llenar la tabla
        date.forEach((element) => {
          let arregloSecundario = [
            element.idDetalle,
            element.descripcionItem,
            element.posologiaDetalle,
            element.cantidadDetalle,
          ];
          arregloDetalleFormula.push(arregloSecundario);
        });

        let table = new DataTable("#tableDetalleFormula", {
          info: false,
          paging: false,
          responsive: true,
          language: {
            url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-CO.json",
          },

          layout: {
            topStart: {
              buttons: {
                buttons: [
                  {
                    extend: "copy",
                    text: '<i class="bi bi-copy"></i>',
                    titleAttr: "Copiar",
                    className: "btn btn-secondary",
                  },
                  {
                    extend: "excel",
                    text: '<i class="bi bi-file-earmark-excel"></i>',
                    titleAttr: "Importar a excel",
                    className: "btn btn-success",
                  },
                  {
                    extend: "pdf",
                    text: '<i class="bi bi-filetype-pdf"></i>',
                    titleAttr: "Importar a pdf",
                    className: "btn btn-danger",
                  },
                  {
                    extend: "print",
                    text: '<i class="bi bi-printer-fill"></i>',
                    titleAttr: "Imprimir",
                    className: "btn btn-info",
                  },
                ],
              },
            },
          },
          columns: [
            { title: "ID" },
            { title: "Medicamente" },
            { title: "Posologia" },
            { title: "Cantidad" },
          ],
          data: arregloDetalleFormula,
        });
      } else {
        infoDetalleFormula.innerHTML = `<div class="alert alert-dark" role="alert">
  No tiene Ningun Detalle Formula el Paciente!
</div>`;
      }
    })
    .catch((error) => {
      console.log("verifica donde consumi el API de datelle formula " + error);
    });
};

// voy hacer una funcion donde se va a reescribir las tablas de la libreria Datatable
const func_reescribirTablas = () => {
  let datosTablaFormulario = document.querySelector(".datosTablaFormulario");
  let etiquetaTablaHistorial = document.querySelector(
    ".etiquetaTablaHistorial"
  );

  let etiquetaTablaDetalleFormula = document.querySelector(
    ".etiquetaTablaDetalleFormula"
  );

  let infoDetalleFormula = document.querySelector(".infoDetalleFormula");
  let infoHistorial = document.querySelector(".infoHistorial");
  infoDetalleFormula.innerHTML = ` <div class="alert alert-light" role="alert">
  Primero Selecione una Fecha de la formula medica para poder
  ver el Detalle Formula
</div>`;
  infoHistorial.innerHTML = ` <div class="alert alert-light" role="alert">
Primero Selecione una Fecha de la formula medica para poder
ver el Historial
</div>`;

  etiquetaTablaHistorial.innerHTML = `<table
  id="tableHistorial"
  class="table table-striped table-hover"
  style="width: 100%"
>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table>`;
  etiquetaTablaDetalleFormula.innerHTML = `<table
id="tableDetalleFormula"
class="table table-striped table-hover"
style="width: 100%"
>
<thead></thead>
<tbody></tbody>
<tfoot></tfoot>
</table>`;
  datosTablaFormulario.innerHTML = `  <table
  id="tableFormulasMedicas"
  class="table table-striped table-hover"
  style="width: 100%"
>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table>`;
};
// ----------------------
// aca voy hacer la funcion donde se va reescribir la tabla de las Citas que se llama "datatable"

const func_RescribirTablaCitas = () => {
  let contendorTablaCitas = document.getElementById("contendorTablaCitas");

  contendorTablaCitas.innerHTML = `<table
  id="datatable"
  class="table table-striped table-hover"
  style="width: 100%"
>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table>`;
};

// ------------------------------
// la misma funcion pero para lo otro
const func_reescribirTablas2 = () => {
  let datosPaciente = document.getElementById("datosPaciente");
  let infoDeFormula = document.querySelector(".infoDeFormula");
  infoDeFormula.innerHTML = ` <div class="alert alert-light" role="alert">
  Ninguna Cita Selecionada Aun
</div>`;
  datosPaciente.innerHTML = `  <h4>Datos Paciente</h4>
<div class="recent-post">
  <div class="media">
    <div class="media-object pull-left">
      <a href="#"
        ><img
          src="images/news-image.jpg"
          class="img-responsive"
          alt=""
      /></a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">
        <a href="#">Selecione un Paciente</a>
      </h4>
    </div>
  </div>
</div>`;
  func_reescribirTablas();
};

// aca voy hacer la funcion que se ejecute cuando se habra el Modal para que consuma el API de los
// medicamentos y se cargue en la tabla

const func_selecionarMedicamentos = async () => {
  let tablaProductos = document.getElementById("tablaProductos");
  let opciones = document.getElementById("opciones");

  let tablaMedicamentoResetados = document.getElementById(
    "tablaMedicamentoResetados"
  );
  let tablaSintomasPaciente = document.getElementById("tablaSintomasPaciente");
  tablaMedicamentoResetados.innerHTML = "";
  tablaSintomasPaciente.innerHTML = "";

  opciones.innerHTML = "";
  tablaProductos.innerHTML = "";
  let medicamentos = await fetch(
    "http://localHost:3000/consultorio/selecionarMedicamentos/"
  );
  medicamentos = await medicamentos.json();
  if (medicamentos.length > 0) {
    medicamentos.forEach((medi) => {
      // este va hacer para llenar la tabla
      let descrip = `<tr> <td>${medi.idItem} </td> <td>${medi.descripcionItem} </td> <td>${medi.existenciaItem} </td> </tr>`;

      // aca voy a poner las Opciones en el select para que el doctor pueda selecionar un medicmanto

      let descripOpciones = `<option value="${medi.idItem}">${medi.descripcionItem}</option>`;
      opciones.innerHTML += descripOpciones;
      tablaProductos.innerHTML += descrip;
    });
  }
};
//----------------------------------------------------------------------------------------------------------

// aca voy hacer la funcion que se va ejecutar al oprimir el boton guardar

const func_guardarMedicamentosEnLaTabla = async () => {
  let formulaConsumir = document.getElementById("formulaConsumir").value;
  let idMedica = document.getElementById("idMedica").value;
  let cantidadMedicamento = document.querySelector(
    "#cantidadMedicamento"
  ).value;
  let yaResetado = false;

  let tablaMedicamentoResetados = document.getElementById(
    "tablaMedicamentoResetados"
  );
  if (
    idMedica.length > 0 &&
    cantidadMedicamento.length > 0 &&
    formulaConsumir.length > 0
  ) {
    let datosMedicamentos = await fetch(
      `http://localHost:3000/consultorio/selecionarMedicamentosResetados/?idMedicamento=${idMedica}&cantidad=${cantidadMedicamento}`
    );
    let jsonMedicamentos = await datosMedicamentos.json();

    if (jsonMedicamentos.procede == true) {
      // aca voy a verificar los que ya estan para ver si le pone mas cantidad o saber si ya lo habia selecionado
      let idDelMedicamento = document.querySelectorAll("#idDelMedicamento");
      console.log(idDelMedicamento);
      if (idDelMedicamento.length > 0) {
        idDelMedicamento.forEach((mediValue) => {
          if (parseInt(mediValue.textContent) == parseInt(idMedica)) {
            yaResetado = true;
          }
        });

        if (yaResetado == true) {
          Swal.fire({
            title: "Medicamento ya Resetado",
            text: "Este Medicamento ya lo seleciono",
            icon: "warning",
          });
        } else {
          let descripMedi = `<tr id="filaMedicamento">  <td id="idDelMedicamento" >${jsonMedicamentos.id} </td> <td>${jsonMedicamentos.nombre} </td> <td>${formulaConsumir} </td> <td>${jsonMedicamentos.cantidad} </td> <td><label  onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></label></td></tr>`;

          tablaMedicamentoResetados.innerHTML += descripMedi;
        }
      } else {
        let descripMedi = `<tr id="filaMedicamento">  <td id="idDelMedicamento" >${jsonMedicamentos.id} </td> <td>${jsonMedicamentos.nombre} </td> <td>${formulaConsumir} </td> <td>${jsonMedicamentos.cantidad} </td>  <td><label  onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></label></td></tr>`;

        tablaMedicamentoResetados.innerHTML += descripMedi;
      }

      document.getElementById("formulaConsumir").value = "";
      document.getElementById("idMedica").value = "";
      document.getElementById("cantidadMedicamento").value = "";

      //--------------------------------------------------------------------------------------
    } else {
      Swal.fire({
        title: "Hubo un error Verificar!!",
        text: jsonMedicamentos.error,
        icon: "warning",
      });
    }
  } else {
    Swal.fire({
      title: "Hubo un error Verificar!!",
      text: "Faltan Casillas por llenar",
      icon: "warning",
    });
  }
};

// aca voy hacer la funcion que va hacer que se elimine la fila de la tabla selecionada

function eliminarFila(boton) {
  var fila = boton.parentNode.parentNode;
  var tabla = fila.parentNode;
  tabla.removeChild(fila);
}

// aca voy hacer la funcion donde al hacer click en guardar se ejecute y se mande los sintomas a la tabla

const func_guardarSintomasEnlaTabla = () => {
  let sintomas = document.getElementById("sintomas");
  let descripcionSintomas = document.getElementById("descripcionSintomas");
  let tablaSintomasPaciente = document.getElementById("tablaSintomasPaciente");
  if (sintomas.value.length > 0 && descripcionSintomas.value.length > 0) {
    let descr = `<tr id="tablaFilaSintomas"> <td>${sintomas.value} </td> <td>${descripcionSintomas.value} </td> <td>  <label  onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></label> </td> </tr>`;
    tablaSintomasPaciente.innerHTML += descr;

    sintomas.value = "";
    descripcionSintomas.value = "";
  } else {
    Swal.fire({
      title: "Faltan Casillas por llenar !!",
      text: "Verificar y llenar los Campos Vacios",
      icon: "warning",
    });
  }
};

// --------------------------------------------------------------------------------------------

// aca voy hacer la funcion para guardar los datos a la base de datos

const func_insertarFormularioAlaBaseDatos = () => {
  /*  var modalAgendarCita = new bootstrap.Modal(
    document.getElementById("modalAgendarCita")
  );

  var exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  ); */

  let tablaFilaSintomas = document.querySelectorAll("#tablaFilaSintomas");
  let tablaMedicamentoResetados = document.querySelectorAll("#filaMedicamento");

  let detalle = [];
  let historial = [];

  // aca voy a verificar si tienen datos las tablas

  if (tablaFilaSintomas.length > 0 && tablaMedicamentoResetados.length > 0) {
    // aca voy a recorrer los tr de la tabla
    tablaFilaSintomas.forEach((fila) => {
      console.log(fila);
      let descripDetalle = [];
      fila.childNodes.forEach(function (nodo) {
        // y aca voy a recorrer los TD de cada fila del TR
        if (nodo.nodeType === Node.ELEMENT_NODE && nodo.tagName === "TD") {
          // console.log(nodo.textContent); // Accede al contenido de cada celda
          descripDetalle.push(nodo.textContent);
        }
      });
      historial.push({
        sintoma: descripDetalle[0],
        descripcion: descripDetalle[1],
      });
    });

    // ----------------------------------------------------
    // aca voy a recorrer los TR de la tabla de Medicamentos resetados

    tablaMedicamentoResetados.forEach((filaTr) => {
      let arregloMedicamento = [];

      filaTr.childNodes.forEach((nodeTD) => {
        if (nodeTD.nodeType === Node.ELEMENT_NODE && nodeTD.tagName === "TD") {
          arregloMedicamento.push(nodeTD.textContent);
        }
      });

      console.log(arregloMedicamento);
      detalle.push({
        cantidadDetalle: arregloMedicamento[3],
        posologiaDetalle: arregloMedicamento[2],
        item_id: arregloMedicamento[0],
      });
    });
    // ----------------------------------
    // aca voy a pasar todo a una variable tipo objeto

    let todoLosDatosMandar = {
      detalle: detalle,
      historial: historial,
    }; // todos los datos de la tabla estan aca
    console.log(todoLosDatosMandar);

    // aca voy hacer para Consumir el API de Insertar los datos

    // aca voy a llenar las variables del ID de la cita y la cedula del medico para poder mandarlo al API
    let idCita = document.getElementById("idCedulaPaciente").value; // aca voy a obtener el ID de la Cita
    let cedulaPaciente = document.getElementById("cedulaPaciente").value; // aca voy a obtener la Cedula del Paciente
    let datosLocalStore = window.localStorage;
    let datosMedico = JSON.parse(datosLocalStore.getItem(1));
    datosMedico = datosMedico.id;

    console.log(
      "cedula :" +
        datosMedico +
        " cita: " +
        idCita +
        " cedula Paciente: " +
        cedulaPaciente
    );
    // ---------------------------------------------------------------------------------
    console.log(JSON.stringify(todoLosDatosMandar));
    console.log(
      `http://localHost:3000/consultorio/insertarDatosFormulario/?cedulaPaciente=${cedulaPaciente}&cedulaMedico=${datosMedico}&idCita=${idCita}`
    );
    fetch(
      `http://localHost:3000/consultorio/insertarDatosFormulario/?cedulaPaciente=${cedulaPaciente}&cedulaMedico=${datosMedico}&idCita=${idCita}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoLosDatosMandar),
      }
    )
      .then((date) => {
        return date.json();
      })
      .then((date) => {
        console.log(date);

        if (date.status == true) {
          // aca voy a poner un Swalert donde va poder escoger si le Agenda una Cita nueva o no

          // Cerrar el primer modal
          console.log("Cerrando el primer modal...");

          Swal.fire({
            title: "Datos Insertados con Exito",
            text: "La Cita ya fue Evaluada deseas Agendar otra Cita?",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Agendar Cita!",
          }).then((result) => {
            // si le da que si va abrir un modal nuevo donde va poder Agendar la Cita

            if (result.isConfirmed) {
              // Abrir el segundo modal
              console.log("Abriendo el segundo modal...");

              modalAgendarCita.show();
            } else {
              window.location.href = "indexConsultorio.html";
            }
          });

          // -------------------------------------------------
        } else {
          Swal.fire({
            title: "Hubo un error!!",
            text: date.erro,
            icon: "warning",
          });
        }
      })
      .catch((error) => {
        console.log("tiene un error al consumir la API " + error);
      });

    // ----------------------------------------------------------
  } else {
    Swal.fire({
      title: "Atencion falta!!",
      text: "Verificar Los sintomas y medicamentos Resetados",
      icon: "warning",
    });
  }
};

// --------------------------------------------------------------------------------------------

// aca voy hacer el evento donde se va ejecutar al darle click en el boton guardar del modal Agendar Cita
let btnGuardarAgendarCita = document.getElementById("btnGuardarAgendarCita");
let cedulaPacienteCita = document.getElementById("cedulaPacienteCita");
let fechaCita = document.getElementById("fechaCita");
let horaCita = document.getElementById("horaCita");

btnGuardarAgendarCita.addEventListener("click", () => {
  if (
    cedulaPacienteCita.value.length > 0 &&
    fechaCita.value.length > 0 &&
    horaCita.value.length > 0
  ) {
    console.log(horaCita.value);
    console.log(fechaCita.value);

    // voy a obtener la Cedula del medico del local Store
    let datosMedico = window.localStorage;
    let cedulaMedi = JSON.parse(datosMedico.getItem(1));
    cedulaMedi = cedulaMedi.id;

    // aca voy a consumir la API para Agendar la cita del paciente

    let datosMandar = {
      cedulaPaciente: cedulaPacienteCita.value,
      cedulaMedico: parseInt(cedulaMedi),
      fechaCita: fechaCita.value,
      horaCita: horaCita.value,
    };

    fetch("http://localHost:3000/consultorio/insertarDatosAgendarCita/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosMandar),
    })
      .then((datosApi) => {
        return datosApi.json();
      })
      .then((datosApi) => {
        if (datosApi.status == true) {
          Swal.fire({
            title: "Agendado Con exito",
            text: datosApi.descripcion,
            icon: "success",
          }).then(() => {
            window.location.href = "indexConsultorio.html";
          });
        } else {
          if (datosApi.error == null) {
            Swal.fire({
              title: "Hora no Disponible",
              text: datosApi.descripcion,
              icon: "info",
            });
          } else {
            Swal.fire({
              title: "Hubo un error",
              text: datosApi.error,
              icon: "error",
            });
          }
        }
      });

    // --------------------------------------------
  } else {
    Swal.fire({
      title: "Faltan Casillas por llenar",
      text: "Llena todas las Casillas para poder Agendar la Cita",
      icon: "info",
    });
  }
});

// ------------------------------------------------------------------------
// aca voy hacer el evento que se va ejecutar cuando le de click al boton de "Citas pendientes"
// entonces que consulte la y aparesca en la tabla si quiere citas pendientes o las confirmadas

let consultasCitas = document.getElementById("consultasCitas");

consultasCitas.addEventListener("click", () => {
  console.log(consultasCitas.innerText);
  if (consultasCitas.innerText == "Citas Pendientes") {
    consultasCitas.innerText = "Citas Confirmadas";
    consultasCitas.className = "btn btn-outline-info";
    func_RescribirTablaCitas();
    func_llenarTablaConsultasCitas(cedulaMedico1, "Pendiente");
    console.log("entro pende");
  } else if (consultasCitas.innerText == "Citas Confirmadas") {
    consultasCitas.innerText = "Citas Pendientes";
    consultasCitas.className = "btn btn-outline-primary";
    func_RescribirTablaCitas();
    func_llenarTablaConsultasCitas(cedulaMedico1, "Confirmado");
    console.log("entro confir");
  }
});

// --------------------------------------------------------------------
var modalAgendarCita = new bootstrap.Modal(
  document.getElementById("modalAgendarCita")
);
// modalAgendarCita.show();
