import nodemailer from 'nodemailer'
import { SENDINBLUE_PASSWORD, SENDINBLUE_USER, SENDINBLUE_HOST, FROM_ADMIN_MAIL, USER_SUBJECT, SENDINBLUE_PORT } from '../config';

export const GenerateOtp = () =>{
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();

    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

    return {otp, expiry}
}

// Email function

let transport = nodemailer.createTransport({
    host: SENDINBLUE_HOST,
    port: SENDINBLUE_PORT,
    auth:{
        user: SENDINBLUE_USER,
        pass: SENDINBLUE_PASSWORD
    },
    tls:{
        rejectUnauthorized: false
    }
})

export const sendEmail = async(from: string, to: string, subject: string, html: string)=> {
    try {
        const response = await transport.sendMail({
          from: FROM_ADMIN_MAIL,
          to,
          subject: USER_SUBJECT,
          html
        });

        return response
    } catch (error) {
        console.log(error)
    }
}

export const emailHtml = (otp:number):string => {
    const temp =`
    <div style="max-width: 700; font-size:110%; border: 10px solid #ddd; padding: 50px 20px; marging: auto;">
        <h2 style ="text-transform: uppercase; text-align: center; color: teal;">Welcome to Ecommerce</h2>
        <p>Hi there, your otp is <span style="font-weight: bold; font-size: 20px">${otp}</span>, it will expire in 30min</p>
    </div>
    `
    return temp
}

export const emailForgotPasswordHtml = (otp:number):string => {
    const temp =`
    <div style="max-width: 700; font-size:110%; border: 10px solid #ddd; padding: 50px 20px; marging: auto;">
        <p>Hi there, your otp is <span style="font-weight: bold; font-size: 20px">${otp}</span>, it will expire in 30min</p>
    </div>
    `
    return temp
}