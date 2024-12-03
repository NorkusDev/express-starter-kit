import DatabaseConnection from "./config";
import { Dialect, Sequelize } from "sequelize";

const { database, port, user, password, host } = DatabaseConnection;

const sequelizeConnection = new Sequelize(database, user, password, {
  dialect: "mysql" as Dialect,
  host: host,
  port: port,
  logging: console.log,

  // dialectOptions: {
  //   options: {
  //     encrypt: false,
  //     trustServerCertificate: true,
  //   },
  // },
},);

export default sequelizeConnection;
