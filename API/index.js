let express = require("express");
let cors = require("cors");

let puerto = 3000;
let app = express();
app.use(cors());
app.use(express.json());

//aca vamos poniendo los microservicios

app.listen(puerto, () => {
  console.log(`APi iniciada en el puerto ${puerto}`);
});
