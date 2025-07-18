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
        return res.status(400).json({
            success: false,
            message: 'Email and password are required!',
            data: null
        });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            logger.info(`User already exists: ${email}`);
            return res.status(409).json({
                success: false,
                message: 'User already exists',
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(Password, 11);

        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        const token = Jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });

        logger.info(`User registered successfully: ${email}`);
        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            data: { token }
        });

    } catch (e: any) {
        logger.error(`Registration failed for ${email}: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            data: { error: e.message }
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, Password } = req.body;

    if (!email || !Password) {
        logger.warn('Login attempt without email or password');
        return res.status(400).json({
            success: false,
            message: 'Email and password are required!',
            data: null
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            logger.warn(`Login failed - email not found: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                data: null
            });
        }

        const isMatch = await bcrypt.compare(Password, user.password);

        if (!isMatch) {
            logger.warn(`Login failed - wrong password for email: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                data: null
            });
        }

        const token = Jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

        logger.info(`Login successful: ${email}`);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token }
        });

    } catch (e: any) {
        logger.error(`Login failed for ${email}: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            data: { error: e.message }
        });
    }
};
