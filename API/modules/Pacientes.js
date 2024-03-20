const express = require("express");
const mysql = require("./mysql");

const citas = express.Router();

//Buscar siempre por id
citas.get("/pacientes/selecionarpaciente/:id", (req, res) => {
    let id = req.params.id;
    let consulta = `select * from cita where paciente_cedulaPaciente=${id}`;
  
    mysql.query(consulta, (error, data) => {
      try{
      res.status(200).send(data);
      }catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    });
  });
  // Crear cita
citas.post("/cita/create", (req, res) => {
    let frmdata = {
        fechaCita: req.body.fechaCita,
        horaCita: req.body.horaCita,
        paciente_cedulaPaciente: req.body.paciente_cedulaPaciente,
        medico_cedulaMedico: req.body.medico_cedulaMedico
    };


    mysql.query("insert into cita set ?", frmdata, (error, data) => {
        try {
            if (error) {
                throw error;
            } else {
                res.status(200).send(data);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en la consulta: " + error.message);
        }
    });
});
   
  module.exports = citas;