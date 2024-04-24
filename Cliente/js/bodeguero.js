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
