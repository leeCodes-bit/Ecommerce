"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postChangePassword = exports.postForgotPassword = exports.userLogin = exports.verifyUserOtp = exports.Register = void 0;
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const config_1 = require("../config");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
/* =============== Register ============== */
const Register = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password, confirm_password } = req.body;
        const id = (0, uuid_1.v4)();
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const userPassword = await (0, utility_1.HashedPassword)(password, salt);
        //generate otp
        const { otp, expiry } = (0, notification_1.GenerateOtp)();
        const User = await userModel_1.UserModel.findOne({ where: { email } });
        //create user
        if (!User) {
            const user = await userModel_1.UserModel.create({
                id,
                email,
                password: userPassword,
                firstname,
                lastname,
                salt,
                address: "",
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "buyer"
            });
            // send email
            const html = (0, notification_1.emailHtml)(otp);
            await (0, notification_1.sendEmail)(config_1.FROM_ADMIN_MAIL, email, config_1.USER_SUBJECT, html);
            // send sms
            return res.status(200).json({
                message: "User created successfully",
                success: true,
                user
            });
        }
        return res.status(400).json({
            Error: "Email already exists"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            Error: 'internal server error',
            route: "/users/signup"
        });
    }
};
exports.Register = Register;
/**=============verify userotp =========== */
const verifyUserOtp = async (req, res) => {
    try {
        //check if user is a registered user
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                Error: "OTP cannot be empty"
            });
        }
        const User = await userModel_1.UserModel.findOne({ where: { email } });
        if (User && User.otp) {
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updateUser = (await userModel_1.UserModel.update({
                    verified: true
                }, { where: { email } }));
                if (updateUser) {
                    const User = await userModel_1.UserModel.findOne({ where: { email } });
                    return res.status(200).json({
                        message: "You have successfully verified your account",
                        verified: User.verified
                    });
                }
            }
        }
        return res.status(400).json({
            Error: "Invalid OTP"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/verify"
        });
    }
};
exports.verifyUserOtp = verifyUserOtp;
/*===========================LOGIN================ */
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.UserModel.findOne({ where: { email } });
        console.log(user);
        if (user.verified === true) {
            // joi validation comes here for email and password
            const validated = await (0, utility_1.validatePassword)(password, user.password, user.salt);
            if (validated) {
                let signature = await (0, utility_1.GenerateSignature)({
                    id: user.id,
                    email
                });
                return res.status(200).json({
                    message: "You have successfully login",
                    signature,
                    role: user.role
                });
            }
            else {
                return res.status(400).json({ Error: "Incorrect email or password" });
            }
        }
        return res.status(401).json({
            Error: "User not verified"
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.userLogin = userLogin;
/*============================FORGOT PASSWORD================ */
const postForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                Error: "Email is required"
            });
        }
        // check if user exists with email address
        const user = await userModel_1.UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ Error: "User not registered" });
        }
        ;
        //generate otp
        const { otp, expiry } = (0, notification_1.GenerateOtp)();
        if (user) {
            // send email
            const html = (0, notification_1.emailForgotPasswordHtml)(otp);
            await (0, notification_1.sendEmail)(config_1.FROM_ADMIN_MAIL, email, config_1.USER_SUBJECT, html);
            const updateUser = (await userModel_1.UserModel.update({
                otp: otp
            }, { where: { email } }));
            if (updateUser) {
                return res.status(200).json({
                    message: "password reset OTP has been sent to your mail",
                    otp,
                    // expiry,
                    success: true
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/forgot-password"
        });
    }
};
exports.postForgotPassword = postForgotPassword;
/*============================ change password================ */
const postChangePassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                Error: "Email is required"
            });
        }
        const user = await userModel_1.UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                Error: "User not registered"
            });
        }
        const { otp, expiry } = (0, notification_1.GenerateOtp)();
        // send email
        const html = (0, notification_1.emailHtml)(otp);
        await (0, notification_1.sendEmail)(config_1.FROM_ADMIN_MAIL, email, config_1.USER_SUBJECT, html);
        res.status(200).json({
            message: "password reset OTP sent to your email",
            otp
        });
    }
    catch (error) {
    }
};
exports.postChangePassword = postChangePassword;
/*============================Reset or change password================ */
// export const posthangePassword = async(req: Request, res: Response)=>{
//     try {
//         const {email} = req.body;
//         if(!email) {
//             return res.status(400).json({
//                 Error: "Email is required"
//             })
//         }
//         const user = await UserModel.findOne({where:{email}}) as unknown as UserAttributes;
//         if(!user) return res.status(400).json({Error: "User not registered"});
//             //generate otp
//             const {otp, expiry} = GenerateOtp();
//           // send email
//           const html = emailHtml(otp);
//           await sendEmail(FROM_ADMIN_MAIL, email, USER_SUBJECT, html);
//          return res.status(200).json({
//             Message: "Password reset OTP sent to your email",
//             otp
//          })
//     } catch (error) {
//     }
// };
/*============================Update password================ */
// export const postResetPassword = async(req: Request, res: Response) => {
//    try {
//     const {token } = req.params;
//     const userDetails = verifySignature(token)
//     const {email} = userDetails  as unknown as {[key:string]:string | number};
//     const {password, confirm_password} = req.body;
//     if(!password){
//         return res.status(400).json({
//             Error: "password and confirm_password are required"
//         })
//     }
//     let users = UserModel.findOne({where:{email}}) as unknown as UserAttributes;
//     if(!users){
//         return res.status(404).json({
//             Error: "User does not exist"
//         })
//     }
//     if(userDetails){
//         if(password !== confirm_password){
//             return res.status(403).json({Error: "password and confirm_password does not match"})
//         }
//         const salt =await GenerateSalt();
//         const hashPassword = await HashedPassword(password, salt);
//         const updatePassword = ()
//     }
//    } catch (error) {
//     console.log(error);
//    }
// }
