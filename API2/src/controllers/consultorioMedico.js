import { cnx } from "../models/bd.js";

export const selecionarCitasPorAtender = async (req, res) => {
  let estado = req.body.estado;
  let idMedico = req.body.idMedico;

  let sql = `CALL selecionarCitasPorAtender`;
  let [filas] = await cnx.query(sql, [idMedico, estado]); // Pasamos los parámetros como un array después de la cadena SQL

  if (!filas) {
    return res.status(200).send(date);
  } else {
    return res.status(404).send(error);
  }
};
