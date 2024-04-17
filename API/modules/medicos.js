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
   
    medicos.get("/medico/verificarMedico/:cedulaMedico", (req, res) => {
      let cedula= req.params.cedulaMedico;
      mysql.query("SELECT*FROM medico WHERE cedulaMedico = ?", [cedula], (error, data) => {
        try {
          if(data==0){
            res.status(400).send("No Existe el doctor en la base de datos!!");
          }else{
            res.status(200).send(data);
          }
         
        }catch (error) {
          console.log(error);
          throw `hay un error en la consulta${error}`;
      }
      });
  });

  medicos.get("/medicamentos/traerEstadisticasMedicos", (req, res) => {
    mysql.query(`
    SELECT 
    YEAR(c.fechaCita) AS year,
    MONTH(c.fechaCita) AS month,
    m.nombreMedico AS nombreMedico,
    COUNT(*) AS totalCitas
FROM 
    cita c
INNER JOIN 
    medico m ON c.medico_cedulaMedico = m.cedulaMedico
GROUP BY 
    YEAR(c.fechaCita), 
    MONTH(c.fechaCita),
    c.medico_cedulaMedico
ORDER BY 
    YEAR(c.fechaCita), 
    MONTH(c.fechaCita),
    COUNT(*) DESC;

    `, (error, data) => {
      try {
        if(data.length === 0) {
          res.status(400).send("No hay datos en la base de datos!!");
        } else {
          res.status(200).send(data);
       // Modificar los datos para incluir el nombre del medicamento
       const estadisticasMedicamentos = data.map(item => ({
        year: item.year,
        month: item.month,
        citas: item.totalCitas,
        totalMedicamentosVendidos: item.nombreMedico
    }));

      }
    } catch (error) {
      console.log(error);
      throw `Hay un error en la consulta: ${error}`;
    }
  });
  });

  module.exports = medicos;