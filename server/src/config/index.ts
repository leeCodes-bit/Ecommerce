import dotenv from 'dotenv';
dotenv.config();

export const SENDINBLUE_USER = process.env.SENDINBLUE_USER as string;
export const SENDINBLUE_PASSWORD = process.env.SENDINBLUE_PASSWORD as string;
export const SENDINBLUE_HOST = process.env.SENDINBLUE_HOST as string;
export const SENDINBLUE_PORT = Number(process.env.SENDINBLUE_PORT);

export const FROM_ADMIN_MAIL = process.env.FROM_ADMIN_MAIL as string;

export const USER_SUBJECT=process.env.USER_SUBJECT as string;
export const APP_SECRET=process.env.APP_SECRET as string;