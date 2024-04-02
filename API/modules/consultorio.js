let express = require("express");
let mysql = require("./mysql.js");

let consultorio = express.Router();
consultorio.use(express.json());

consultorio.get("/consultorio/selecionarCitasPorAtender", (req, res) => {
  let estado = req.query.estado;
  let nombre = req.query.nombre;
  let consulta = `SELECT cita.idCita,cita.fechaCita,cita.horaCita,cita.estadoCita, CONCAT(paciente.nombrePaciente," ",paciente.apellidoPaciente) As paciente ,medico.nombreMedico FROM cita INNER JOIN medico ON cita.medico_cedulaMedico=medico.cedulaMedico INNER JOIN paciente ON cita.paciente_cedulaPaciente=paciente.cedulaPaciente WHERE cita.estadoCita =? and medico.cedulaMedico=?;`;
  mysql.query(consulta, [estado, nombre], (error, date) => {
    if (!error) {
      res.status(200).send(date);
    } else {
      res.status(404).send(error);
    }
  });
});

//aca voy hacer una consulta donde voy a selecionar al paciente
consultorio.get("/consultorio/selecionarDatosPaciente/:id", (req, res) => {
  let id = req.params.id;

  let consulta = `SELECT * FROM paciente WHERE paciente.cedulaPaciente =(SELECT cita.paciente_cedulaPaciente FROM cita WHERE cita.idCita =${id})`;
  mysql.query(consulta, (error, data) => {
    if (!error) {
      res.status(200).send(data);
    } else {
      res.status(404).send(error);
    }
  });
});

//aca voy hacer una consulta donde voy a selecionar las formulas medicas de los clientes

consultorio.get("/consultorio/selecionarDatosPaciente/", (req, res) => {
  let cedula = req.query.cedula;
  let dactor = req.query.dactor;

  let consulta = `select formula.idFormula,paciente.nombrePaciente,medico.nombreMedico,formula.fechaFormula from formula INNER JOIN paciente ON formula.paciente_cedulaPaciente=paciente.cedulaPaciente INNER JOIN medico ON formula.medico_cedulaMedico=medico.cedulaMedico where paciente_cedulaPaciente=(SELECT cita.paciente_cedulaPaciente from cita WHERE cita.idCita=?) and medico_cedulaMedico=?`;

  mysql.query(consulta, [cedula, dactor], (error, date) => {
    if (!error) {
      res.status(200).send(date);
    } else {
      res.status(404).send(error);
    }
  });
});

//aca voy hacer el API donde va selecionar el Historial

consultorio.get(
  "/consultorio/selecionarDatosHistorial/:idFormula",
  (req, res) => {
    let idFormula = req.params.idFormula;

    let consulta =
      `SELECT * FROM historialclinico WhERE formula_idFormula =` + idFormula;

    mysql.query(consulta, (error, date) => {
      if (!error) {
        res.status(200).send(date);
      } else {
        res.status(404).send(error);
      }
    });
  }
);

//aca voy hacer el API donde va selecionar el detalleFormula

consultorio.get(
  "/consultorio/selecionarDetalleFormula/:idFormula",
  (req, res) => {
    let idFormula = req.params.idFormula;

    let consulta =
      `SELECT detalleformula.idDetalle,item.descripcionItem,detalleformula.posologiaDetalle,detalleformula.cantidadDetalle FROM detalleformula INNER JOIN item ON detalleformula.item_idItem=item.idItem WhERE formula_idFormula =` +
      idFormula;

    mysql.query(consulta, (error, date) => {
      if (!error) {
        res.status(200).send(date);
      } else {
        res.status(404).send(error);
      }
    });
  }
);

// aca voy hacer la API donde voy a llamar la tabla de los medicamentos
consultorio.get("/consultorio/selecionarMedicamentos/", (req, res) => {
  let consulta = `SELECT * FROM item WHERE existenciaItem > 0`;
  mysql.query(consulta, (error, date) => {
    if (!error) {
      res.status(200).send(date);
    } else {
      res.status(404).send(error);
    }
  });
});

// aca voy hacer un API para consultar los medicamentos para agregar a la tabla

consultorio.get("/consultorio/selecionarMedicamentosResetados/", (req, res) => {
  let idMedicamento = req.query.idMedicamento;
  let cantidad = req.query.cantidad;
  let consulta = `SELECT * FROM item where idItem=` + idMedicamento;

  mysql.query(consulta, (error, date) => {
    if (!error) {
      // aca voy hacer una desicion para que pueda enviarse si tiene la cantidad que requiere en el inventario
      if (date.length > 0) {
        if (cantidad <= date[0].existenciaItem) {
          res.status(200).send({
            procede: true,
            nombre: date[0].descripcionItem,
            id: date[0].idItem,
            cantidad: cantidad,
            error: null,
          });
        } else {
          res.status(404).send({
            procede: false,
            nombre: null,
            id: null,
            cantidad: null,
            error: "Esa cantidad no hay en el inventario",
          });
        }
      } else {
        res.status(404).send({
          procede: false,
          nombre: null,
          id: null,
          cantidad: null,
          error: "Ese Medicamento no existe en el inventario",
        });
      }
    } else {
      res.status(505).send({
        procede: false,
        nombre: null,
        id: null,
        cantidad: null,
        error: "error en la API " + error,
      });
    }
  });
});

// aca voy hacer la API donde va insertar los datos de la formula,datalle formula y el historial
// a la base de DAtos

consultorio.post("/consultorio/insertarDatosFormulario/", async (req, res) => {
  try {
    let fechaActual = new Date();
    fechaActual = `${fechaActual.getFullYear()}-${
      fechaActual.getMonth() + 1
    }-${fechaActual.getDate()}`;

    let cedulaPaciente = req.query.cedulaPaciente;
    let cedulaMedico = req.query.cedulaMedico;
    let idCita = req.query.idCita;
    let idFormulaCreada;
    let objetoDatosFormula = req.body;

    // Insertación a la tabla de formula
    let insertacionFormula = new Promise((resolve, reject) => {
      let consultaFormula = `INSERT INTO formula(fechaFormula, paciente_cedulaPaciente, medico_cedulaMedico, cita_idCita) VALUES ('${fechaActual}', ${cedulaPaciente}, ${cedulaMedico}, ${idCita})`;
      mysql.query(consultaFormula, (error, date) => {
        if (!error) {
          idFormulaCreada = parseInt(date.insertId);
          resolve(true);
        } else {
          reject(
            "Hubo un error en la inserción de la Formula. Verificar: " + error
          );
        }
      });
    });

    // Esperar a que se complete la inserción de la fórmula
    let insertoFormulaBolea = await insertacionFormula;

    // Si la inserción de la fórmula fue exitosa, proceder con la inserción de los detalles de la fórmula
    if (insertoFormulaBolea) {
      for (const detalleFormula of objetoDatosFormula.detalle) {
        let consultaInsertacionDetalle = `INSERT INTO detalleformula(cantidadDetalle, posologiaDetalle, item_idItem, formula_idFormula) VALUES (${detalleFormula.cantidadDetalle}, '${detalleFormula.posologiaDetalle}', ${detalleFormula.item_id}, ${idFormulaCreada})`;
        await new Promise((resolve, reject) => {
          mysql.query(consultaInsertacionDetalle, (error, date) => {
            if (error) {
              reject(
                "Hubo un error en la inserción en el detalle de la fórmula. Verifique: " +
                  error
              );
            } else {
              console.log(date);
              resolve();
            }
          });
        });
      }
      res.send("bien");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

//----------------------------------------------------------------------------------
module.exports = consultorio;
