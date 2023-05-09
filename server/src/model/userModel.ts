import {sequelize, DataTypes } from "../db/db";

const UserModel = sequelize.define("user",{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate:{
        //     notNull:{
        //         mgs: "password is required"
        //     }
        // }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: false
    },
    lng : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lat : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    verified : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    salt : {
        type: DataTypes.STRING,
        allowNull: false
    },
    role : {
        type: DataTypes.STRING,
        allowNull: false
    },
}
);

export default UserModel