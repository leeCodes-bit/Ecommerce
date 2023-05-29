import passport from "passport";
import { 
    Strategy as GoogleStrategy, 
    Profile as GoogleProfile, 
    VerifyCallback as GoogleVerifyCallback 
} from "passport-google-oauth20";
import { UserModel } from "../model/userModel";

export = (passport: passport.Authenticator) => {

}