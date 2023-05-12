"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypes = exports.Sequelize = exports.sequelize = exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
Object.defineProperty(exports, "DataTypes", { enumerable: true, get: function () { return sequelize_1.DataTypes; } });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const POSTGRES_URL = process.env.DATABASE_URL;
const sequelize = new sequelize_1.Sequelize(POSTGRES_URL);
exports.sequelize = sequelize;
/*============ sequelize connection =========== */
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("connection has been established successfully");
    }
    catch (error) {
        console.log("unable to connect to db", error);
    }
}
exports.connectDB = connectDB;
//  const POSTGRES_URL = process.env.DATABASE_URLS as string
//  const sequelize = new Sequelize(POSTGRES_URL, {
//      dialect: "postgres",
//      dialectOptions:{
//           ssl:{
//         rejectUnauthorized: false,
//         require: true
//       },
//      },
//  })
/*============ sequelize connection =========== */
//  async function connectDB() {
//      try {
//          await sequelize.authenticate() 
//          console.log("connection has been established successfully")
//      } catch (error) {
//          console.log("unable to connect to db",error)
//      }
//  }
//  export {connectDB,sequelize, Sequelize, DataTypes}
