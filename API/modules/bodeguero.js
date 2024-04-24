/* import mysql from "./mysql";
import express from "express"; */

let mysql = require("./mysql");
let express = require("express");
let bodeguero = express.Router();
bodeguero.use(express.json());

bodeguero.get(
  "/bodeguero/selecionarMedicamentosResetados/:cedula",
  (req, res) => {
    let cedula = req.params.cedula;
    let consulta = `SELECT detalleformula.idDetalle,item.descripcionItem,detalleformula.cantidadDetalle,detalleformula.plazoReclamacion from detalleformula INNER JOIN item ON detalleformula.item_idItem = item.idItem WHERE formula_idFormula IN (SELECT idFormula from formula WHERE paciente_cedulaPaciente =${cedula}) ORDER by idDetalle DESC;`;

    mysql.query(consulta, (erro, date) => {
      if (!erro) {
        res.status(200).send({
          status: true,
          descripcion: "consulta realizada con exito",
          error: null,
          datos: date,
        });
      } else {
        res.status(404).send({
          status: false,
          descripcion: "Error al realizar la consulta",
          error: erro,
          datos: null,
        });
      }
    });
  }
);

module.exports = bodeguero;
