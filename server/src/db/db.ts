import { Sequelize, DataTypes } from "sequelize"
import dotenv from 'dotenv'

dotenv.config()
const POSTGRES_URL = process.env.DATABASE_URL as unknown as string

const sequelize = new Sequelize(POSTGRES_URL)

/*============ sequelize connection =========== */
async function connectDB() {
    try {
        await sequelize.authenticate() 
        console.log("connection has been established successfully")
        
    } catch (error) {
        console.log("unable to connect to db",error)
    }
}

export {connectDB,sequelize, Sequelize, DataTypes}

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