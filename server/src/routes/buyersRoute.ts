import express from 'express';
import { Register, verifyUserOtp } from '../controller/usersController';

const router = express.Router()

router.post('/signup', Register)
router.post('/verify', verifyUserOtp)

export default router;