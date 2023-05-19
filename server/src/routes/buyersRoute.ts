import express from 'express';
import { Register, verifyUserOtp, login } from '../controller/usersController';

const router = express.Router()

router.post('/signup', Register)
router.post('/verify', verifyUserOtp)
router.post('/login', login)

export default router;