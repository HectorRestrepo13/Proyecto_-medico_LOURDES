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
   
  //Traer datos del paciente por identificacion
citas.get("/paciente/traerDatosPaciente/:identificacion", (req, res) => {
  let identificacion = req.params.identificacion; //parametro
  mysql.query("SELECT cedulaPaciente, nombrePaciente, apellidoPaciente, emailPaciente,telefonoPaciente, movilPaciente, fechaNacimientoPqciente, epsPaciente, usuarioPaciente FROM paciente WHERE cedulaPaciente = ?", [identificacion], (error, data) => {
    try {
      if(data==0){
        res.status(400).send("No hay datos en la base de datos!!");
      }else{
        
        res.status(200).send(data);
      }
     
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});


 //Verificar que el paciente exista 
 citas.get("/paciente/verificarPaciente/:identificacion", (req, res) => {
  let identificacion = req.params.identificacion; //parametro
  mysql.query("SELECT*FROM paciente WHERE cedulaPaciente = ?", [identificacion], (error, data) => {
    try {
      if(data==0){
        res.status(400).send("No hay datos en la base de datos!!");
      }else{
        
        res.status(200).send(data);
      }
     
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});

 //Editar datos personales del paciente
citas.put("/paciente/editarPaciente/:cedulaPaciente", (req, res) => {
  let cedulaPaciente = req.params.cedulaPaciente; //parametro
  let frmdata = {
      nombrePaciente: req.body.nombrePaciente,
      apellidoPaciente: req.body.apellidoPaciente,
      emailPaciente: req.body.emailPaciente,
      telefonoPaciente: req.body.telefonoPaciente,
      movilPaciente: req.body.movilPaciente,
      fechaNacimientopqciente: req.body.fechaNacimientopqciente,
      epsPaciente: req.body.epsPaciente,
      usuarioPaciente: req.body.usuarioPaciente
  }; 
     
  mysql.query("UPDATE paciente SET ? where cedulaPaciente=?", [frmdata,cedulaPaciente], (error, data) => {
    try {
      if(data==0){
        res.status(400).send("No hay datos en la base de datos!!");
      }else{
        res.status(200).send("Datos actualizados");
      }
     
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
}); 

 //Editar datos personales del paciente
 citas.get("/paciente/MostrarCitas/:medico_cedulaMedico", (req, res) => {

let cedulaMedico=req.params.medico_cedulaMedico;
     
  mysql.query("select fechaCita from cita where medico_cedulaMedico= ?", [cedulaMedico], (error, data) => {
    try {
      if(data==0){
        res.status(400).send("No hay datos en la base de datos!!");
      }else{
        res.status(200).send(data);
      }
     
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
}); 
 //Mostrar graficamente los datos de los pacientes atendidos por mes
citas.get("/paciente/traerEstadisticasPaciente", (req, res) => {
  mysql.query(`
    SELECT 
        YEAR(fechaCita) AS year,
        MONTH(fechaCita) AS month,
        COUNT(*) AS totalPacientesAtendidos
    FROM 
        cita
    GROUP BY 
        YEAR(fechaCita), 
        MONTH(fechaCita)
    ORDER BY 
        YEAR(fechaCita), 
        MONTH(fechaCita);
  `, (error, data) => {
    try {
      if(data.length === 0) {
        res.status(400).send("No hay datos en la base de datos!!");
      } else {
        res.status(200).send(data);
      // Transformar datos para Chart.js
      const labels = data.map(item => `${item.year}-${item.month}`); // Formato: "AAAA-MM"
      const datos = data.map(item => item.totalPacientesAtendidos);
    }
  } catch (error) {
    console.log(error);
    throw `Hay un error en la consulta: ${error}`;
  }
});
});

 //Mostrar graficamente los datos de las citas facturadas  por mes
 citas.get("/paciente/traerEstadisticascitasFacturadas", (req, res) => {
  mysql.query(`
  SELECT 
  YEAR(fechaCita) AS year,
  MONTH(fechaCita) AS month,
  COUNT(*) AS totalCitas

FROM 
  cita
GROUP BY 
  YEAR(fechaCita), 
  MONTH(fechaCita)
ORDER BY 
  YEAR(fechaCita), 
  MONTH(fechaCita);

  `, (error, data) => {
    try {
      if(data.length === 0) {
        res.status(400).send("No hay datos en la base de datos!!");
      } else {
        res.status(200).send(data);
      // Transformar datos para Chart.js
      const labels = data.map(item => `${item.year}-${item.month}`); // Formato: "AAAA-MM"
      const datos = data.map(item => item.totalCitas);
    }
  } catch (error) {
    console.log(error);
    throw `Hay un error en la consulta: ${error}`;
  }
});
});

  module.exports = citas;