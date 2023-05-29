import {Request, Response} from 'express';
import { registerSchema, option, GenerateSalt, HashedPassword, GenerateSignature, validatePassword } from '../utils/utility';
import { GenerateOtp, emailHtml, sendEmail, emailForgotPasswordHtml } from '../utils/notification';
import { FROM_ADMIN_MAIL, USER_SUBJECT } from '../config';
import {UserModel} from '../model/userModel';
import {v4 as uuidv4} from 'uuid';
import { UserAttributes } from '../model/userModel';

/* =============== Register ============== */
export const Register = async(req: Request, res: Response) => {
    try {
        const {firstname, lastname, email, phone, password, confirm_password} = req.body;

        const id = uuidv4()
        const validateResult = registerSchema.validate(req.body, option);

        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        //generate salt
        const salt =await GenerateSalt();
        const userPassword = await HashedPassword(password, salt);

        //generate otp
        const {otp, expiry} = GenerateOtp();

        //check if user exists
        interface IKey {
            [key: string]: string
            }
       const User =await UserModel.findOne({where:{email}}) as unknown as IKey;

        //create user
        if(!User){
          const user = await UserModel.create({
                id,
                email, 
                password: userPassword,
                firstname,
                lastname,
                salt, 
                address:"",
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role:"buyer"
            });

            // send email
            const html = emailHtml(otp);
            await sendEmail(FROM_ADMIN_MAIL, email, USER_SUBJECT, html)

            // send sms
            

            return res.status(200).json({
                message: "User created successfully",
                success: true,
                user
            })
        }
        return res.status(400).json({
            Error: "Email already exists"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            Error: 'internal server error',
            route: "/users/signup"
        })
    }
}

/**=============verify userotp =========== */

export const verifyUserOtp = async(req: Request, res: Response) =>{
  try {
      //check if user is a registered user
      const {email, otp} =req.body;

      if(!email || !otp){
        return res.status(400).json({
            Error: "OTP cannot be empty"
        })
      }

      const User = await UserModel.findOne({where:{email}}) as unknown as UserAttributes;
  
      if(User && User.otp){
          if(User.otp === parseInt(otp) && User.otp_expiry >= new Date()){
              const updateUser = ((await UserModel.update({
                  verified: true
              },{where: {email}})) as unknown) as UserAttributes;
  
          if(updateUser){
          const User = await UserModel.findOne({where:{email}}) as unknown as UserAttributes;
  
          return res.status(200).json({
              message: "You have successfully verified your account",
              verified: User.verified
          })
          }
  
          }
  
      }
      return res.status(400).json({
        Error: "Invalid OTP"
    })  

  } catch (error) {
    res.status(500).json({
        Error: "Internal server error",
        route:"/users/verify"
    })
  }

}

/*===========================LOGIN================ */
export const userLogin = async(req: Request, res: Response)=>{
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({where: {email}}) as unknown as UserAttributes;
        console.log(user);

        if(user.verified === true){
            // joi validation comes here for email and password

            const validated = await validatePassword(password, user.password, user.salt);

            if(validated){
                let signature = await GenerateSignature({
                    id: user.id,
                    email
                })
                return res.status(200).json({
                    message: "You have successfully login",
                    signature,
                    role: user.role
                })
            }else{
                return res.status(400).json({Error: "Incorrect email or password"})
            }
        }
            return res.status(401).json({
                Error: "User not verified"
            })

    } catch (error) {
        console.log(error)
    }
}

/*============================FORGOT PASSWORD================ */
export const postForgotPassword = async(req: Request, res: Response)=>{
    try {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({
                Error: "Email is required"
            })
        }
        // check if user exists with email address
        const user = await UserModel.findOne({where: {email}}) as unknown as UserAttributes;

        if(!user){ return res.status(400).json({Error: "User not registered"})};

         //generate otp
         const {otp, expiry} = GenerateOtp();

        if(user){
        // send email
        const html = emailForgotPasswordHtml(otp);
        await sendEmail(FROM_ADMIN_MAIL, email, USER_SUBJECT, html);

        const updateUser = ((await UserModel.update({
            otp: otp
        },{where: {email}})) as unknown) as UserAttributes;

        if(updateUser){
            return res.status(200).json({
                message: "password reset OTP has been sent to your mail",
                otp,
                // expiry,
                success: true
            })
        }
    }
          
    } catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route:"/users/forgot-password"
        })
    }
}

/*============================ change password================ */
export const postChangePassword = async (req: Request, res: Response) => {
    try {
        const {email} = req.body

        if(!email){
            return res.status(400).json({
                Error: "Email is required"
            })
        }

        const user = await UserModel.findOne({where: {email}}) as unknown as UserAttributes;

        if(!user){
            return res.status(404).json({
                Error: "User not registered"
            })
        }

        const {otp, expiry} = GenerateOtp();

        // send email
        const html = emailHtml(otp);
        await sendEmail(FROM_ADMIN_MAIL, email, USER_SUBJECT, html);

        res.status(200).json({
            message: "password reset OTP sent to your email",
            otp
        })

    } catch (error) {
        
    }
}





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




