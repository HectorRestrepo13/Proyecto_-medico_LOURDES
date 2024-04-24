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
  let emailUser = req.params.email;
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
  let consulta =
    "SELECT * FROM paciente WHERE emailPaciente = ? AND passwordPaciente = ?";
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



// Cambiar contrasena si el usuario lo desea o se le olvida
login.post("/login/cambiarContrasenaUsuarios/:cedula/:nuevaContrasena", (req, res) => {
  let cedula = req.params.cedula;
  let nuevaContrasena = req.params.nuevaContrasena;

  // Función para actualizar la contraseña de un usuario en una tabla específica
  function actualizarContrasena(tabla, columnaCedula, columnaPassword, nombreTabla) {
      let consultaUsuario = `SELECT * FROM ${tabla} WHERE ${columnaCedula}=?`;
      let actualizarContrasenaQuery = `UPDATE ${tabla} SET ${columnaPassword}=? WHERE ${columnaCedula}=?`;

      mysql.query(consultaUsuario, [cedula], (error, resultado) => {
          if (error) {
              res.status(500).send({
                  status: false,
                  message: `Error al buscar el usuario en la tabla ${nombreTabla}`,
                  error: error
              });
              return;
          }

          if (resultado.length === 0) {
             
              return;
          }

          mysql.query(actualizarContrasenaQuery, [nuevaContrasena, cedula], (error, resultado) => {
              if (error) {
                  res.status(500).send({
                      status: false,
                      message: "Error al actualizar la contraseña",
                      error: error,
                      tableName: nombreTabla
                  });
                  return;
              }

              res.status(200).send({
                  status: true,
                  message: "Contraseña actualizada correctamente",
                  tableName: nombreTabla
              });
          });
      });
  }

  // Llamamos a la función para actualizar la contraseña en cada tabla
  actualizarContrasena('medico', 'cedulaMedico', 'password', 'medico');
  actualizarContrasena('users', 'cedulaUser', 'password', 'users');
  actualizarContrasena('paciente', 'cedulaPaciente', 'passwordPaciente', 'paciente');
});
/* login.post("/login/cambiarContrasenaMedico/:cedula/:nuevaContrasena", (req, res) => {
  let cedula = req.params.cedula;
  let nuevaContrasena = req.params.nuevaContrasena;

  // Primero verificamos si el usuario existe con la cédula proporcionada
  let consultaUsuario = `SELECT * FROM medico WHERE cedulaMedico=?`;
  mysql.query(consultaUsuario, [cedula], (error, resultado) => {
    if (!error) {
      if (resultado.length > 0) {
        // Si el usuario existe, actualizamos la contraseña
        let actualizarContrasena = `UPDATE medico SET password=? WHERE cedulaMedico=?`;
        mysql.query(actualizarContrasena, [nuevaContrasena, cedula], (error, resultado) => {
          if (!error) {
            res.status(200).send({
              status: true,
              message: "Contraseña actualizada correctamente",
            });
          } else {
            res.status(500).send({
              status: false,
              message: "Error al actualizar la contraseña",
              error: error,
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          message: "Usuario no encontrado con la cédula proporcionada",
        });
      }
    } else {
      res.status(500).send({
        status: false,
        message: "Error al buscar el usuario",
        error: error,
      });
    }
  });
});

login.post("/login/cambiarContrasenaUsers/:cedula/:nuevaContrasena", (req, res) => {
  let cedula = req.params.cedula;
  let nuevaContrasena = req.params.nuevaContrasena;

  // Primero verificamos si el usuario existe con la cédula proporcionada
  let consultaUsuario = `SELECT * FROM users WHERE cedulaUser=?`;
  mysql.query(consultaUsuario, [cedula], (error, resultado) => {
    if (!error) {
      if (resultado.length > 0) {
        // Si el usuario existe, actualizamos la contraseña
        let actualizarContrasena = `UPDATE users SET password=? WHERE cedulaUser=?`;
        mysql.query(actualizarContrasena, [nuevaContrasena, cedula], (error, resultado) => {
          if (!error) {
            res.status(200).send({
              status: true,
              message: "Contraseña actualizada correctamente",
            });
          } else {
            res.status(500).send({
              status: false,
              message: "Error al actualizar la contraseña",
              error: error,
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          message: "Usuario no encontrado con la cédula proporcionada",
        });
      }
    } else {
      res.status(500).send({
        status: false,
        message: "Error al buscar el usuario",
        error: error,
      });
    }
  });
});


login.post("/login/cambiarContrasenaPaciente/:cedula/:nuevaContrasena", (req, res) => {
  let cedula = req.params.cedula;
  let nuevaContrasena = req.params.nuevaContrasena;

  // Primero verificamos si el usuario existe con la cédula proporcionada
  let consultaUsuario = `SELECT * FROM paciente WHERE cedulaPaciente=?`;
  mysql.query(consultaUsuario, [cedula], (error, resultado) => {
    if (!error) {
      if (resultado.length > 0) {
        // Si el usuario existe, actualizamos la contraseña
        let actualizarContrasena = `UPDATE paciente SET passwordPaciente=? WHERE cedulaPaciente=?`;
        mysql.query(actualizarContrasena, [nuevaContrasena, cedula], (error, resultado) => {
          if (!error) {
            res.status(200).send({
              status: true,
              message: "Contraseña actualizada correctamente",
            });
          } else {
            res.status(500).send({
              status: false,
              message: "Error al actualizar la contraseña",
              error: error,
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          message: "Usuario no encontrado con la cédula proporcionada",
        });
      }
    } else {
      res.status(500).send({
        status: false,
        message: "Error al buscar el usuario",
        error: error,
      });
    }
  });
});
 */



module.exports = login;
