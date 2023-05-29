import express from 'express';
import { Register, verifyUserOtp, userLogin, postForgotPassword } from '../controller/usersController';

const router = express.Router()

router.post('/signup', Register)
router.post('/verify', verifyUserOtp)
router.post('/login', userLogin)
router.post('/forgot-password', postForgotPassword)

export default router;