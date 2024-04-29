import { createPool } from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: "././.env" }); // aca configuro para poder utilizar las variables que tengo en ".env"
// hago la conexion con createPool con este puede abrir varias conexiones

export const cnx = createPool({
  host: process.env.MYSQL_HOST, // y aca las llamo
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();
