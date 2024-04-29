import { Router } from "express";
import { selecionarCitasPorAtender } from "../controllers/consultorioMedico.js";

const consultorio = Router();

consultorio.get(
  "/consultorio/selecionarCitasPorAtender",
  selecionarCitasPorAtender
);

export default consultorio;
