let express = require("express");
let mysql = require("./mysql");

let login = express.Router();

//selecionar Usuario medico para saber si existe y ingrese session
login.get("/login/selecionarUsuarioMedico/:email/:password", (req, res) => {
  let consulta = `select * from medico where emailMedico=? and password=?`;
  let emailMedico = req.params.email;
  let password = req.params.password;


  mysql.query(consulta, [emailMedico, password], (error, date) => {
    if (!error) {
      if (date.length > 0) {
        res.status(200).send(date);
      } else {
        res.status(200).send({
          status: false,
          message: "Usuario No registrado",
          codigo: 200,
        });
      }
    } else {
      res.status(404).send(error);
    }
  });
});

//selecionar Usuario trabajodres para saber si existe y ingrese session

login.get("/login/selecionarUsuario/:email/:password", (req, res) => {
  let consulta = "select * from users where emailUser=? and password=?";
  let emailUser = req.params.emailUser;
  let password = req.params.password;

  mysql.query(consulta, [emailUser, password], (error, date) => {
    if (!error) {
      if (date.length > 0) {
        res.status(200).send(date);
      } else {
        res.status(200).send({
          status: false,
          message: "Usuario No registrado",
          codigo: 200,
        });
      }
    } else {
      res.status(404).send(error);
    }
  });
});

login.get("/login/selecionarPaciente/:email/:password", (req, res) => {
  let consulta = "SELECT * FROM paciente WHERE emailPaciente = ? AND passwordPaciente = ?";
  let email = req.params.email;
  let password = req.params.password;

  mysql.query(consulta, [email, password], (error, data) => {
    if (!error) {
      if (data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(200).send({
          status: false,
          message: "Paciente no registrado",
          codigo: 200,
        });
      }
    } else {
      res.status(500).send(error);
    }
  });
});
login.get("/login/selecionarAdmin/:email/:password", (req, res) => {
  let consulta = "SELECT * FROM admins WHERE correoAdmin = ? AND password = ?";
  let email = req.params.email;
  let password = req.params.password;

  mysql.query(consulta, [email, password], (error, data) => {
    if (!error) {
      if (data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(200).send({
          status: false,
          message: "admin no existe no registrado",
          codigo: 200,
        });
      }
    } else {
      res.status(500).send(error);
    }
  });
});

module.exports = login;
