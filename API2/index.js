import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import consultorioMedico from "./src/routes/consultorioMedico.js";

let app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(consultorioMedico);
app.listen(port, () => {
  console.log("server ejecutandose" + port);
});
