"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashedPassword = exports.GenerateSalt = exports.option = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
