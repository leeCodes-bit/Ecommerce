"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailForgotPasswordHtml = exports.emailHtml = exports.sendEmail = exports.GenerateOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
// Email function
let transport = nodemailer_1.default.createTransport({
    host: config_1.SENDINBLUE_HOST,
    port: config_1.SENDINBLUE_PORT,
    auth: {
        user: config_1.SENDINBLUE_USER,
        pass: config_1.SENDINBLUE_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendEmail = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.FROM_ADMIN_MAIL,
            to,
            subject: config_1.USER_SUBJECT,
            html
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendEmail = sendEmail;
const emailHtml = (otp) => {
    const temp = `
    <div style="max-width: 700; font-size:110%; border: 10px solid #ddd; padding: 50px 20px; marging: auto;">
        <h2 style ="text-transform: uppercase; text-align: center; color: teal;">Welcome to Ecommerce</h2>
        <p>Hi there, your otp is <span style="font-weight: bold; font-size: 20px">${otp}</span>, it will expire in 30min</p>
    </div>
    `;
    return temp;
};
exports.emailHtml = emailHtml;
const emailForgotPasswordHtml = (otp) => {
    const temp = `
    <div style="max-width: 700; font-size:110%; border: 10px solid #ddd; padding: 50px 20px; marging: auto;">
        <p>Hi there, your otp is <span style="font-weight: bold; font-size: 20px">${otp}</span>, it will expire in 30min</p>
    </div>
    `;
    return temp;
};
exports.emailForgotPasswordHtml = emailForgotPasswordHtml;
