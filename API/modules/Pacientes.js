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
  //Buscar inactivos siempre por id
citas.get("/pacientes/selecionarpacienteRechazados/:id", (req, res) => {
    let id = req.params.id;
    let consulta = `select * from cita where paciente_cedulaPaciente=${id} and estadoCita='pendiente'`;
  
    mysql.query(consulta, (error, data) => {
      try{
      res.status(200).send(data);
      }catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    });
  });

    //Pruebas
citas.get("/pacientes/selecionarpacienteRechazados", (req, res) => {
 
    let consulta = `select * from cita where estadoCita='pendiente'`;
  
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

//Editar registro
//Actualizar un registro
citas.put("/cita/update/:id", (req, res) => {
    let idCita = req.params.id; //parametro
    let frmdata = {
        fechaCita: req.body.fechaCita,
        horaCita: req.body.horaCita,
        paciente_cedulaPaciente: req.body.paciente_cedulaPaciente,
        medico_cedulaMedico: req.body.medico_cedulaMedico
    };
    mysql.query("update cita set ? where idCita = ?", [frmdata,idCita ], (error, data) => {
      try {
        res.status(200).send("Actualizacion exitosa!!");
      } catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    });
  });
   
  module.exports = citas;