import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controllers';


const authrouter = express.Router();

authrouter.post('/auth/register', registerUser);
authrouter.post('/auth/login', loginUser);

export default authrouter;