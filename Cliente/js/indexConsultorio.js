(function () {
  //para inicializar datatable de la manera mas simple

  //-------------------------------------------------------------------
  /* let datatable;
  datatable = $("#example").DataTable({
    retrieve: true,
    dom: "Blfrtip",
    pageLength: 10,
    order: [[1, "asc"]],
    buttons: [
      {
        extend: "excelHtml5",
        text: "EXCEL",
      },
      {
        extend: "csvHtml5",
        text: "CSV",
      },
      {
        extend: "pdfHtml5",
        text: "PDF",
      },
    ],
    columnDefs: [
      {
        visible: false,
        searchable: true,
      },
    ],
    language: {
      sProcessing: "",
      sLengthMenu: "Mostrar _MENU_ registros",
      sZeroRecords: "No se encontraron resultados",
      sEmptyTable: "Ningún dato disponible en esta tabla",
      sInfo:
        "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
      sInfoPostFix: "",
      sSearch: "Buscar:",
      searchPlaceholder: "Buscar..",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords:
        "<img style='display: block;width:100px;margin:0 auto;' src='assets/img/loading.gif' />",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
        sSortDescending:
          ": Activar para ordenar la columna de manera descendente",
      },
    },
  }); */

  //-------------------------------------------------------
  let NombreSesion = document.getElementById("NombreSesion");
  let btnCerrarSesion = document.getElementById("btnCerrarSesion");
  let datosLocal = window.localStorage;

  //aca voy hacer una decision que si no hay datos en el local store es porque no a iniciado sesion entonces
  //que lo envie para el index
  let date = JSON.parse(datosLocal.getItem(1));
  if (date && date.nombre) {
    NombreSesion.innerText = date.nombre;
  } else {
    window.location.href = "../index.html";
  }

  //aca voy hacer el evento que se va ejecutar apenas le de click en cerrar sesion

  btnCerrarSesion.addEventListener("click", () => {
    console.log("hola")
    datosLocal.clear();
    window.location.href = "../index.html";
  });

})();
