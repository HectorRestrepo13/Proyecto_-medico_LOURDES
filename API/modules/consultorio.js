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
module.exports = consultorio;
