// tabla de reclamacion

/* new DataTable("#tblReclamacion", {
  layout: {
    bottomEnd: {
      paging: {
        boundaryNumbers: false,
      },
    },
  },
}); */

// aca voy a mandar los datos a la tabla y despues la inicializo

let inventarioItem = document.getElementById("inventarioItem");
fetch("http://localHost:3000/bodeguero/consultarTodoMedicamentos")
  .then((date) => {
    return date.json();
  })
  .then((date) => {
    date.datos.forEach((elemen) => {
      let des = `<tr> <td>${elemen.idItem} </td> <td>${elemen.descripcionItem} </td> <td>${elemen.existenciaItem} </td> <td><button data-bs-toggle="modal" data-bs-target="#modalEditarItem" onclick="func_editarItem('${elemen.idItem}','${elemen.descripcionItem}','${elemen.existenciaItem}')"  type="button" id="btnEditarItem" class="btn btn-warning">Editar</button></td></tr>`;

      inventarioItem.innerHTML += des;
    });
    new DataTable("#tblInventarioTotal", {
      responsive: true,
    });
  });

// ---------------------------------

let medicamentoAMandar = document.getElementById("medicamentoAMandar");
// ----
new DataTable("#datatable", {
  paging: false,
  responsive: true,
  language: {
    url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-CO.json",
  },
});

let botonBuscarCedula = document.getElementById("botonBuscarCedula");

botonBuscarCedula.addEventListener("click", () => {
  let cedulaPaciente = document.getElementById("cedulaPaciente").value;
  if (cedulaPaciente.length > 0) {
    fetch(
      `http://localHost:3000/bodeguero/selecionarMedicamentosResetados/${cedulaPaciente}`
    )
      .then((date) => {
        return date.json();
      })
      .then((date) => {
        if (date.status == true) {
          if (date.datos.length > 0) {
            let tablaProduct = document.getElementById("tablaMedicamentos");
            tablaProduct.innerHTML = `<table
id="datatable"
class="table table-striped table-hover"
style="width: 100%"
>
<thead>
  <tr>
    <th>ID</th>
    <th>Nombre</th>
    <th>Apellido</th>
  </tr>
</thead>
<tbody></tbody>
<tfoot></tfoot>
</table>`;
            arregloPrincipal = [];
            console.log(date);
            date.datos.forEach((element) => {
              let fechaModi = new Date(element.plazoReclamacion);
              fechaModi = `${fechaModi.getDate()}/${
                fechaModi.getMonth() + 1
              }/${fechaModi.getFullYear()}`;

              // ------------
              let arregloSecundario = [
                element.idDetalle,
                element.descripcionItem,
                element.cantidadDetalle,
                fechaModi,
              ];
              arregloPrincipal.push(arregloSecundario);
            });

            let table = new DataTable("#datatable", {
              info: false,

              responsive: true,
              language: {
                url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-CO.json",
              },

              columns: [
                { title: "ID" },
                { title: "Medicamento" },
                { title: "Cantidad" },
                { title: "Plazo Reclamacion" },
              ],
              data: arregloPrincipal,
            });

            // este va hacer el evento para selecionar las cosas de la tabla
            $("#datatable tbody").on("click", "td", function () {
              // Obtener los datos de la fila correspondiente a la celda clicada
              let rowData = table.row($(this).closest("tr")).data();
              console.log(rowData[0]);
              fetch(
                `http://localHost:3000/bodeguero/verificarCantidadMedicamentos?idDetalle=${rowData[0]}&cantidad=${rowData[2]}`
              )
                .then((datos) => {
                  return datos.json();
                })
                .then((datos) => {
                  console.log(datos.status);
                  if (datos.status == true) {
                    let yaEstas = false;
                    // Selecciona el tbody dentro del cual se encuentran las filas de la tabla
                    let tbody = document.querySelector("#medicamentoAMandar");

                    // Selecciona todas las filas dentro del tbody
                    let filas = tbody.querySelectorAll("tr");

                    // Itera sobre cada fila
                    filas.forEach((fila) => {
                      // Obtiene el contenido del primer td de la fila actual
                      let primerTD =
                        fila.querySelector("td:first-child").textContent;

                      // Compara el contenido del primer td con algo específico
                      if (primerTD == rowData[0]) {
                        // Realiza alguna acción si la comparación es verdadera
                        yaEstas = true;
                      }
                    });
                    // aca si  es false es porque ese medicamento no lo a selecionado
                    if (yaEstas == false) {
                      medicamentoAMandar.innerHTML += `<tr id="filaTblReclmacion" > <td>${rowData[0]} </td> <td>${rowData[1]} </td><td>${rowData[2]} </td> </tr>`;
                    }
                  } else {
                    Swal.fire({
                      title: "No hay en el Inventario",
                      text: "No hay esa cantidad en el inventario",
                      icon: "warning",
                    });
                  }
                });

              //----
            });
          } else {
            Swal.fire({
              title: " Hubo un error Verifique la Cedula",
              text: "Cedula no Existe",
              icon: "warning",
            });
          }
        } else {
          Swal.fire({
            title: date.descripcion,
            text: date.error,
            icon: "error",
          });
        }
      });
  } else {
    Swal.fire({
      title: "Faltan Datos",
      text: "Ingrese la cedula para poder Buscar",
      icon: "info",
    });
  }
});

// aca voy hacer el evento donde al darle click al boton pagar va hacer que el medicamento fue entregado
let BtnPagarMedicamentos = document.getElementById("BtnPagarMedicamentos");

BtnPagarMedicamentos.addEventListener("click", () => {
  // Selecciona el tbody dentro del cual se encuentran las filas de la tabla
  let tbody = document.querySelector("#medicamentoAMandar");

  // Selecciona todas las filas dentro del tbody
  let filas = tbody.querySelectorAll("tr");

  console.log(filas);

  if (filas.length > 0) {
    let insertoTodo = true;
    // Itera sobre cada fila
    filas.forEach(async (fila) => {
      // Obtiene el contenido del primer td de la fila actual
      let primerTD = fila.querySelectorAll("td");
      console.log(primerTD[2].textContent);

      let idDetalleFormula = parseInt(primerTD[0].textContent);
      let cantidad = parseInt(primerTD[2].textContent);

      // voy a comenzar a consumir la API para que actualice los medicamentos
      let API = await fetch(
        `http://localHost:3000/bodeguero/pagarMedicamentosSelecionados/?idMedicam=${idDetalleFormula}&cantidad=${cantidad}`,
        { method: "PUT" }
      );

      let jsonAPi = await API.json();

      console.log(jsonAPi);
      if (jsonAPi.status == false) {
        insertoTodo = false;
      }
    });

    if (insertoTodo) {
      Swal.fire({
        title: "Pago Exitoso",
        text: "Los medicamentos han sido resetados",
        icon: "success",
      }).then(() => {
        window.location.href = "frmBodeguero.html";
      });
    } else {
      Swal.fire({
        title: "Hubo un error al guardar los medicamentos!",
        text: "Verificar con el Programador",
        icon: "error",
      });
    }
  } else {
    Swal.fire({
      title: "No hay medicamentos selecionados!",
      text: "Selecione los medicamentos para poder Pagar",
      icon: "info",
    });
  }
});

// aca voy a colocar la funcion que se ejecutara cuando le de click en editar el Item de la tabla
const func_editarItem = (idItem, nombreMedicamento, cantidadMedicamenti) => {
  document.getElementById("tituloModal").textContent =
    "Editar Medicamento: " + nombreMedicamento;

  document.getElementById("inputNombreItem").value = nombreMedicamento;
  document.getElementById("inputCantidadItem").value = cantidadMedicamenti;
  document.getElementById("idItem").value = idItem;
};

// aca voy hacer el evento que se va ejecutar cuando le de click en guardar los cambios del Item

document.getElementById("GuardarCambiosItem").addEventListener("click", () => {
  let idItem = document.getElementById("idItem").value;
  let nombreItem = document.getElementById("inputNombreItem").value;
  let cantidadItem = document.getElementById("inputCantidadItem").value;
  console.log(idItem);
  console.log(nombreItem);
  console.log(cantidadItem);

  fetch(
    `http://localHost:3000/bodeguero/updateMedicamento?idItem=${idItem}&nombreItem=${nombreItem}&cantidadItem=${cantidadItem}`,
    { method: "PUT" }
  )
    .then((datos) => {
      return datos.json();
    })
    .then((datos) => {
      if (datos.status == true) {
        Swal.fire({
          title: "Se Actualizo con Exito!",
          text: "El medicamento se Actualizo en la base de datos",
          icon: "success",
        }).then(() => {
          window.location.href = "frmBodeguero.html";
        });
      } else {
        Swal.fire({
          title: "No se pudo Actualizar!",
          text: datos.error,
          icon: "warning",
        });
      }
    });
});
