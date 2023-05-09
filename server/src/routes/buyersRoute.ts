import express from 'express';
import { Register } from '../controller/usersController';

const router = express.Router()

router.post('/signup', Register)

export default router;