const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const puerto = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

//aca vamos poniendo los microservicios

app.use("/", require("./modules/login"));
<<<<<<< HEAD
app.use("/", require("./modules/consultorio"));

=======
app.use("/", require("./modules/Pacientes"));
app.use("/", require("./modules/medicos"));
>>>>>>> de3aee9b4dccb9af9d4c68c248f67c87dd7f801b
app.listen(puerto, () => {
  console.log(`APi iniciada en el puerto ${puerto}`);
});
