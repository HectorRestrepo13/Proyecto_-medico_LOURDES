const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");
const puerto = 3000;
const app = express();
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

//aca vamos poniendo los microservicios

app.use("/", require("./modules/login"));

app.use("/", require("./modules/consultorio"));

app.use("/", require("./modules/Pacientes"));
app.use("/", require("./modules/medicos"));
app.use("/", require("./modules/historialClinico"));
app.use("/", require("./modules/medicamentos"));
<<<<<<< HEAD
app.use("/", require("./modules/bodeguero"));

=======
app.use("/", require("./modules/users"));
>>>>>>> 5b34ae65c735f0043e6e9bc58698ddda57c925db
app.listen(puerto, () => {
  console.log(`APi iniciada en el puerto ${puerto}`);
});
