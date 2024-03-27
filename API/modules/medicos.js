const express = require("express");
const mysql = require("./mysql");

const medicos = express.Router();

//Buscar siempre por id
medicos.get("/medico/buscarEspecialidadMedico", (req, res) => {

    let consulta = `select especialidadMedico from medico`;
  
    mysql.query(consulta, (error, data) => {
      try{
      res.status(200).send(data);
      }catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    });
  });
  
    medicos.get("/medico/buscarMedico/:especialidadMedico", (req, res) => {
        let especialidadMedico= req.params.especialidadMedico;
        let consulta = `select nombreMedico, cedulaMedico from medico where especialidadMedico=?`;
    
        mysql.query(consulta,[especialidadMedico], (error, data) => {
        try{
        res.status(200).send(data);
        }catch (error) {
            console.log(error);
            throw `hay un error en la consulta${error}`;
        }
        });
    });
  
  module.exports = medicos;