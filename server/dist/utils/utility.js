"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.GenerateSignature = exports.HashedPassword = exports.GenerateSalt = exports.option = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref("password")).required().label("Confirm password").messages({ "any.only": "{{#label}} does not match" })
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
};
const GenerateSalt = async () => {
    return await bcryptjs_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const HashedPassword = async (password, salt) => {
    return await bcryptjs_1.default.hash(password, salt);
};
exports.HashedPassword = HashedPassword;
const GenerateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET);
};
exports.GenerateSignature = GenerateSignature;
// export const GenerateSignature = async(email:string) => {
//     return jwt.sign(email, APP_SECRET) as unknown as JwtPayload
// }
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return await (0, exports.HashedPassword)(enteredPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
