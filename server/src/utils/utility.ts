import Joi from "joi";
import bcrypt from 'bcryptjs'
import jwt, {JwtPayload} from "jsonwebtoken";
import { APP_SECRET } from "../config";


export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: Joi.any().equal(Joi.ref("password")).required().label("Confirm password").messages({"any.only": "{{#label}} does not match"})

});

export const option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const HashedPassword = async(password:string, salt:string) => {
    return await bcrypt.hash(password, salt)
}

interface IUser {
    email: string,
    id: string
}

export const GenerateSignature = async(payload: IUser) => {
    return jwt.sign(payload, APP_SECRET) as unknown as JwtPayload
}

// export const GenerateSignature = async(email:string) => {
//     return jwt.sign(email, APP_SECRET) as unknown as JwtPayload
// }

export const validatePassword = async(enteredPassword:string, savedPassword:string, salt:string) => {
    return await HashedPassword(enteredPassword, salt) === savedPassword;
}