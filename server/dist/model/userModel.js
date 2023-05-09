"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db/db");
const UserModel = db_1.sequelize.define("user", {
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: db_1.DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: db_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: db_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        // validate:{
        //     notNull:{
        //         mgs: "password is required"
        //     }
        // }
    },
    address: {
        type: db_1.DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: db_1.DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: db_1.DataTypes.INTEGER,
        allowNull: false
    },
    otp_expiry: {
        type: db_1.DataTypes.DATE,
        allowNull: false
    },
    lng: {
        type: db_1.DataTypes.INTEGER,
        allowNull: false
    },
    lat: {
        type: db_1.DataTypes.INTEGER,
        allowNull: false
    },
    verified: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    salt: {
        type: db_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: db_1.DataTypes.STRING,
        allowNull: false
    },
});
exports.default = UserModel;
