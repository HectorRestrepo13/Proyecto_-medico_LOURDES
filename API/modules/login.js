let express = require("express");
let mysql = require("./mysql");

let login = express.Router();

//selecionar Usuario medico para saber si existe y ingrese session
login.get("/login/selecionarUsuarioMedico", (req, res) => {
  let emailMedico = req.query.emailMedico;
  let password = req.query.password;
  let consulta = `select * from medico where emailMedico=? and password=?`;

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

login.get("/login/selecionarUsuariotrabajador", (req, res) => {
  let consulta = "select * from users where emailUser=? and password=?";
  let emailUser = req.query.emailUser;
  let password = req.query.password;

  mysql.query(consulta, [emailUser, password], (error, date) => {
    if (!error) {
      if (date.length > 0) {
        res.status(200).send({
          status: true,
          message: "Usuario Registrado",
          codigo: 200,
        });
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
module.exports = login;
