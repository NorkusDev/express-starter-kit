import dotenv from "dotenv";
import path from "path";
import { IDatabaseConnection } from "../../abstraction/database";
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const DatabaseConnection: IDatabaseConnection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default DatabaseConnection;
