import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import prisma from "../Prisma";
import logger from "../logger"; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const registerUser = async (req: Request, res: Response) => {
    const { email, Password } = req.body;

    if (!email || !Password) {
        logger.error('Register attempt without email or password');
        return res.status(401).json({ message: 'Email and Password Required !' });
    }

    try {
        const exsistingUser = await prisma.user.findUnique({ where: { email } });
        if (exsistingUser) {
            logger.info(`User already exists: ${email}`);
            return res.status(404).json({ message: 'User already exsist' });
        }

        const hashedPassword = await bcrypt.hash(Password, 11);
        const newuser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        const token = Jwt.sign({ id: newuser.id }, JWT_SECRET, { expiresIn: '1d' });
        logger.info(`User registered successfully: ${email}`);
        res.status(200).json({ message: 'User registered successfully', token });

    } catch (e: any) {
        logger.error(`Registration failed for ${email}: ${e.message}`);
        res.status(409).json({ message: 'Registration Failed', error: e.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, Password } = req.body;

    if (!email || !Password) {
        logger.warn('Login attempt without email or password');
        return res.status(401).json({ message: 'Email and Password Required !' });
    }

    try {
        const User = await prisma.user.findUnique({ where: { email } });
        if (!User) {
            logger.warn(`Login failed - email not found: ${email}`);
            return res.status(404).json({ message: 'Invalid Credentials!' });
        }

        const ismatch = await bcrypt.compare(Password, User.password);
        if (!ismatch) {
            logger.warn(`Login failed - wrong password for email: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = Jwt.sign({ id: User.id }, JWT_SECRET, { expiresIn: '1d' });
        logger.info(`Login successful: ${email}`);
        res.status(200).json({ message: 'Login successful', token });

    } catch (e: any) {
        logger.error(`Login failed for ${email}: ${e.message}`);
        res.status(409).json({ message: 'Something went wrong please try again later!', error: e.message });
    }
};
